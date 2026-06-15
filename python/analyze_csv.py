# For analysing the uploaded CSV file

import sys
import pandas as pd
import re
import json

from csv_utils import read_csv, clean_numeric_strings
from detect_column_types import detect_column_types


def delete_repeated_columns(df: pd.DataFrame) -> pd.DataFrame:
    repeated_columns = []
    seen_base_names = set()

    for column in df.columns:
        # pandas automatically renames repeating column names to include a .1 or .2 etc..
        base_name = re.sub(r"\.\d+$", "", column)

        if base_name in seen_base_names:
            repeated_columns.append(column)
        else:
            seen_base_names.add(base_name)
    return df.drop(columns=repeated_columns)

def delete_repeated_rows(df: pd.DataFrame) -> pd.DataFrame:
    return df.drop_duplicates()

def standardize_values(df: pd.DataFrame, column_types: dict[str, str]) -> pd.DataFrame:
    for column, column_type in column_types.items():
        if column not in df.columns:
            continue

        if column_type in ["monetary", "numeric"]:
            converted = clean_numeric_strings(df[column])
            converted = pd.to_numeric(converted, errors="coerce")
            df[column] = converted
        elif column_type == "datetime":
            converted = pd.to_datetime(df[column], errors="coerce", format="mixed")
            df[column] = converted

    return df


def improve_column_names(df: pd.DataFrame) -> dict:
    improved_names = {}

    for column in df.columns:
        improved_names[column] = " ".join(word.capitalize() for word in column.split("_"))

    return improved_names

def get_numeric_correlations(df: pd.DataFrame, column_types: dict[str, str]) -> dict:
    numeric_columns = [col for col, col_type in column_types.items() if col_type in ["numeric", "monetary"] and col in df.columns]
    correlations = df[numeric_columns].corr().to_dict()

    for col in correlations:
        for other_col in correlations[col]:
            if col == other_col:
                continue
            corr_value = correlations[col][other_col]
            if pd.isna(corr_value):
                correlations[col][other_col] = None
            else:
                correlations[col][other_col] = round(corr_value, 4)
    
    return correlations

def get_scatter_charts(
    df: pd.DataFrame,
    correlations: dict,
    min_correlation: float = 0.5,
    max_points: int = 500
) -> list[dict]:
    charts = []

    seen_pairs = set()

    for x_column, related_columns in correlations.items():
        for y_column, correlation in related_columns.items():
            if correlation is None:
                continue

            if x_column == y_column:
                continue

            pair_key = tuple(sorted([x_column, y_column]))

            if pair_key in seen_pairs:
                continue

            seen_pairs.add(pair_key)

            if abs(correlation) < min_correlation:
                continue

            chart_df = df[[x_column, y_column]].dropna()

            if chart_df.empty:
                continue

            # Correlation is calculated from all data,
            # but chart points are capped so the frontend does not get overloaded.
            if len(chart_df) > max_points:
                chart_df = chart_df.sample(max_points, random_state=42)

            charts.append({
                "id": f"scatter-{x_column}-{y_column}",
                "chartType": "scatter",
                "title": f"{x_column} vs {y_column}",
                "description": f"",
                "xColumn": x_column,
                "yColumn": y_column,
                "correlation": correlation,
                "data": [
                    {
                        "x": float(row[x_column]),
                        "y": float(row[y_column]),
                    }
                    for _, row in chart_df.iterrows()
                ],
            })

    charts.sort(key=lambda chart: abs(chart["correlation"]), reverse=True)

    return charts

def get_bar_charts(df: pd.DataFrame, column_types: dict[str, str], max_categories: int = 10) -> list[dict]:
    charts = []

    for column, column_type in column_types.items():
        if column_type != "categorical" or column not in df.columns:
            continue

        value_counts = df[column].value_counts().nlargest(max_categories)

        charts.append({
            "id": f"bar-{column}",
            "chartType": "bar",
            "title": f"Distribution of {column}",
            "description": f"",
            "xColumn": column,
            "yColumn": "count",
            "data": [
                {
                    "x": str(index),
                    "y": int(count),
                }
                for index, count in value_counts.items()
            ],
        })

    return charts

def get_line_charts(df: pd.DataFrame, column_types: dict[str, str]) -> list[dict]:
    charts = []

    datetime_columns = [col for col, col_type in column_types.items() if col_type == "datetime" and col in df.columns]
    numeric_columns = [col for col, col_type in column_types.items() if col_type in ["numeric", "monetary"] and col in df.columns]

    for datetime_col in datetime_columns:
        for numeric_col in numeric_columns:
            chart_df = df[[datetime_col, numeric_col]].dropna().sort_values(by=datetime_col)

            if chart_df.empty:
                continue

            chart_df[datetime_col] = pd.to_datetime(chart_df[datetime_col])
            
            chart_df = chart_df.set_index(datetime_col)
            
            chart_weekly_sum_df = chart_df.resample('W').sum().dropna().reset_index()
            chart_weekly_avg_df = chart_df.resample('W').mean().dropna().reset_index()
            chart_daily_sum_df = chart_df.resample('D').sum().dropna().reset_index()
            chart_daily_avg_df = chart_df.resample('D').mean().dropna().reset_index()
            chart_monthly_sum_df = chart_df.resample('ME').sum().dropna().reset_index()
            chart_monthly_avg_df = chart_df.resample('ME').mean().dropna().reset_index()
            chart_yearly_sum_df = chart_df.resample('YE').sum().dropna().reset_index()
            chart_yearly_avg_df = chart_df.resample('YE').mean().dropna().reset_index()

            charts.append({
                "id": f"line-{datetime_col}-{numeric_col}",
                "title": f"{numeric_col} over Time",
                "description": "",
                "chartType": "line",
                "charts": [
                    {
                        "name": "Daily Average",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_daily_avg_df.iterrows()
                        ]
                    },
                    {
                        "name": "Weekly Average",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_weekly_avg_df.iterrows()
                        ]
                    },
                    {
                        "name": "Monthly Average",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_monthly_avg_df.iterrows()
                        ]
                    },
                    {
                        "name": "Yearly Average",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_yearly_avg_df.iterrows()
                        ]
                    },
                    {
                        "name": "Daily Sum",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_daily_sum_df.iterrows()
                        ]
                    },
                    {
                        "name": "Weekly Sum",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_weekly_sum_df.iterrows()
                        ]
                    },
                    {
                        "name": "Monthly Sum",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_monthly_sum_df.iterrows()
                        ]
                    },
                    {
                        "name": "Yearly Sum",
                        "xColumn": datetime_col,
                        "yColumn": numeric_col,
                        "data": [
                            {"x": row[datetime_col].isoformat(), "y": float(row[numeric_col])}
                            for _, row in chart_yearly_sum_df.iterrows()
                        ]
                    }                      
                ]
            })

    return charts

import copy

def get_numeric_summaries(df: pd.DataFrame, column_types: dict[str, str]) -> dict:
    summaries = {}
    numeric_cols = [col for col, col_type in column_types.items() if col_type in ["numeric", "monetary"] and col in df.columns]
    
    for col in numeric_cols:
        desc = df[col].describe()
        summaries[col] = {
            "min": round(desc["min"], 2),
            "average": round(desc["mean"], 2),
            "median": round(desc["50%"], 2),
            "max": round(desc["max"], 2),
            "is_skewed": bool(abs(desc["mean"] - desc["50%"]) > (desc["mean"] * 0.5))
        }
    return summaries

def get_categorical_summaries(df: pd.DataFrame, column_types: dict[str, str]) -> dict:
    summaries = {}
    cat_cols = [col for col, col_type in column_types.items() if col_type == "categorical" and col in df.columns]
    
    total_rows = len(df)
    for col in cat_cols:
        top_values = df[col].value_counts().nlargest(3)
        summaries[col] = [
            {"value": str(val), "percentage": round((count / total_rows) * 100, 1)}
            for val, count in top_values.items()
        ]
    return summaries

def get_time_trends(df: pd.DataFrame, column_types: dict[str, str]) -> dict:
    trends = {}
    datetime_cols = [col for col, col_type in column_types.items() if col_type == "datetime" and col in df.columns]
    numeric_cols = [col for col, col_type in column_types.items() if col_type in ["numeric", "monetary"] and col in df.columns]
    
    for dt_col in datetime_cols:
        for num_col in numeric_cols:
            temp_df = df[[dt_col, num_col]].dropna().sort_values(by=dt_col)
            if temp_df.empty:
                continue
                
            temp_df[dt_col] = pd.to_datetime(temp_df[dt_col])
            monthly = temp_df.set_index(dt_col).resample('M').sum()
            
            if len(monthly) >= 2:
                first_month = monthly[num_col].iloc[0]
                last_month = monthly[num_col].iloc[-1]
                
                if first_month > 0:
                    growth = ((last_month - first_month) / first_month) * 100
                    trends[f"{num_col} over time"] = {
                        "direction": "Upwards" if growth > 0 else "Downwards",
                        "overall_change_percent": round(growth, 1)
                    }
    return trends

def link_related_charts(charts: list[dict], max_related: int = 3) -> list[dict]:
    linked_charts = copy.deepcopy(charts)

    line_charts_only = [c for c in charts if c.get("chartType") == "line"]

    for current_chart in linked_charts:
        if current_chart.get("chartType") != "line":
            continue

        related_pool = []
        current_x_column = current_chart["charts"][0]["xColumn"]

        for potential_match in line_charts_only:
            if current_chart["id"] == potential_match["id"]:
                continue

            match_x_column = potential_match["charts"][0]["xColumn"]
            
            if current_x_column == match_x_column:
                related_pool.append(potential_match)

        related_pool = related_pool[:max_related]

        current_chart["relatedLineCharts"] = related_pool

    return linked_charts

def analyze_csv(file_path: str, column_types: dict[str, str]) -> dict:
    df, enc = read_csv(file_path)
    df = delete_repeated_columns(df)
    df = delete_repeated_rows(df)
    df = standardize_values(df, column_types)
    improved_column_names = improve_column_names(df)
    
    correlations = get_numeric_correlations(df, column_types)

    charts = get_scatter_charts(df, correlations)
    charts.extend(get_bar_charts(df, column_types))
    charts.extend(get_line_charts(df, column_types))

    charts = link_related_charts(charts)
    
    result = {
        "encoding": enc,
        "columns": df.columns.tolist(),
        "improvedColumnNames": improved_column_names,
        "columnTypes": column_types,
        "missingValues": df.isnull().sum().to_dict(),
        "uniqueValues": {col: df[col].nunique() for col in df.columns},
        "numericSummaries": get_numeric_summaries(df, column_types),
        "categoricalSummaries": get_categorical_summaries(df, column_types),
        "timeTrends": get_time_trends(df, column_types),
        "correlations": correlations,
        "charts": charts,
    }
    
    return result

if __name__ == "__main__":
    file_path = sys.argv[1]

    column_types = None
    try:
        column_types = json.loads(sys.argv[2])
    except:
        df, _ = read_csv(file_path)
        column_types = detect_column_types(df)

    analysis_result = analyze_csv(file_path, column_types)
    print(json.dumps(analysis_result, allow_nan=False))