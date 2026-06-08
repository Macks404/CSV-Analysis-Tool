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
                "description": f"Correlation: {correlation}",
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

def analyze_csv(file_path: str, column_types: dict[str, str]) -> dict:
    df, enc = read_csv(file_path)
    df = delete_repeated_columns(df)
    df = delete_repeated_rows(df)
    df = standardize_values(df, column_types)
    improved_column_names = improve_column_names(df)

    result = {
        "encoding": enc,
        "columns": df.columns.tolist(),
        "improvedColumnNames": improved_column_names,
        "columnTypes": column_types,
        "missingValues": df.isnull().sum().to_dict(),
        "uniqueValues": {col: df[col].nunique() for col in df.columns},
        "correlations": get_numeric_correlations(df, column_types),
        "scatterCharts": get_scatter_charts(df, get_numeric_correlations(df, column_types))
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