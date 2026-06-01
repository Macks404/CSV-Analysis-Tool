# For analysing the uploaded CSV file

import sys
import pandas as pd
import re
import json

def read_csv(file_path: str) -> tuple: # (DATAFRAME, ENCODING TYPE)
    encodings = ["utf-8", "utf-8-sig", "cp1252", "latin1"]
    error = None
    for encoding in encodings:
        try:
            return pd.read_csv(file_path, encoding=encoding), encoding
        except UnicodeDecodeError as err:
            error = err
    raise ValueError(f"Couldn't read CSV file due to encoding error: {error}")

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
        if column_type in ["monetary", "numeric"]:
            converted = clean_numeric_strings(df[column])
            converted = pd.to_numeric(converted, errors="coerce")
            df[column] = converted
        elif column_type == "datetime":
            converted = pd.to_datetime(df[column], errors="coerce", format="mixed")
            df[column] = converted

    return df

def clean_numeric_strings(values: pd.Series) -> pd.Series:
    cleaned = values.astype(str).str.strip()

    # Accounting negatives like "(£1,200)" mean -1200
    is_accounting_negative = cleaned.str.match(r"^\(.*\)$")

    # Keep only digits, decimal points, commas, and minus signs
    cleaned = cleaned.str.replace(r"[^\d.,\-]", "", regex=True)

    # Remove thousands separators
    cleaned = cleaned.str.replace(",", "", regex=False)

    # Restore negative sign for accounting-style negatives
    cleaned = cleaned.where(~is_accounting_negative, "-" + cleaned)

    return cleaned

def improve_column_names(df: pd.DataFrame) -> dict:
    improved_names = {}

    for column in df.columns:
        improved_names[column] = " ".join(word.capitalize() for word in column.split("_"))

    return improved_names

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
        "uniqueValues": {col: df[col].nunique() for col in df.columns}
    }
    
    return result

if __name__ == "__main__":
    file_path = sys.argv[1]
    column_types = json.loads(sys.argv[2])
    analysis_result = analyze_csv(file_path, column_types)
    print(json.dumps(analysis_result, indent=4))