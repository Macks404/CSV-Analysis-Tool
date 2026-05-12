# For analysing the uploaded CSV file

import sys
import json
import pandas as pd

def detect_column_types(df):
    results = {}

    for col in df.columns:
        column_data = df[col]
        non_null_data = column_data.dropna()

        if non_null_data.empty:
            results[col] = "empty"

        elif pd.api.types.is_bool_dtype(column_data):
            results[col] = "boolean"

        elif pd.api.types.is_numeric_dtype(column_data):
            results[col] = "numeric"

        else:
            converted_dates = pd.to_datetime(non_null_data, errors="coerce")
            date_ratio = converted_dates.notna().mean()
            
            if date_ratio > 0.8:
                results[col] = "datetime"
            elif column_data.nunique() < 20:
                results[col] = "categorical"
            else:
                results[col] = "text"

    return results


def analyze_csv(file_path: str):
    df = pd.read_csv(file_path)
    column_types = detect_column_types(df)

    result = {
        "num_rows": len(df),
        "num_columns": len(df.columns),
        "columns": df.columns.tolist(),
        "data_types": df.dtypes.apply(lambda x: x.name).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "unique_values": {col: df[col].nunique() for col in df.columns},
        "column_types": column_types
    }
    
    return result

if __name__ == "__main__":
    file_path = sys.argv[1]
    analysis_result = analyze_csv(file_path)
    print(json.dumps(analysis_result, indent=4))