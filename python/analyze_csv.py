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
        if column_type == "numeric":
            converted = pd.to_numeric(df[column],errors="coerce")
            df[column] = converted

    return df

def is_monetary(column: pd.Series) -> bool:
    text_values = column.astype(str).str.strip()

    currency_symbols = "£$€¥₹₩₽₺₫₪₴₦₱฿₡₲₵₭₮₸₼₾₿"

    currency_codes = [
        "USD", "GBP", "EUR", "JPY", "CNY", "INR",
        "AUD", "CAD", "NZD", "CHF",
        "HKD", "SGD", "KRW", "TWD",
        "SEK", "NOK", "DKK", "ISK",
        "PLN", "CZK", "HUF", "RON", "BGN",
        "TRY", "RUB", "UAH",
        "BRL", "MXN", "ARS", "CLP", "COP", "PEN",
        "ZAR", "NGN", "EGP", "MAD", "KES",
        "AED", "SAR", "QAR", "KWD", "BHD", "OMR",
        "ILS", "THB", "MYR", "IDR", "PHP", "VND",
        "PKR", "BDT", "LKR", "NPR",
        "BTC", "ETH",
    ]

    currency_regex = (
        rf"[{currency_symbols}]"
        + r"|(?:\b"
        + r"\b|\b".join(currency_codes)
        + r"\b)"
    )

    has_currency_symbol = text_values.str.contains(currency_regex, case=False, regex=True)

    if has_currency_symbol.mean() > 0.8:
        return True
    
    monetary_terms = r"\b(?:amount|price|cost|value|total|fee|charge|payment|salary|wage|income|revenue|expense|gross)\b"
    column_name = str(column.name)

    # Can also check if the values are numeric and the column header contains currency related words
    if bool(re.search(monetary_terms, column_name, flags=re.IGNORECASE)):
        numeric_values = pd.to_numeric(text_values.str.replace(currency_regex, "", regex=True), errors="coerce")
        if numeric_values.notna().mean() > 0.8:
            return True

    return False

def clean_csv(df: pd.DataFrame) -> pd.DataFrame:
    df = delete_repeated_columns(df)
    df = delete_repeated_rows(df)
    df = standardize_values(df, detect_column_types(df))
    return df

def detect_column_types(df) -> dict:
    results = {}

    for col in df.columns:
        column_data = df[col]
        non_null_data = column_data.dropna()

        if non_null_data.empty:
            results[col] = "empty"

        elif pd.api.types.is_bool_dtype(column_data):
            results[col] = "boolean"

        elif is_monetary(non_null_data):
            results[col] = "monetary"

        elif pd.api.types.is_numeric_dtype(column_data):
            results[col] = "numeric"

        else:
            converted_dates = pd.to_datetime(non_null_data, errors="coerce",format="mixed")
            date_ratio = converted_dates.notna().mean()
            
            if date_ratio > 0.8:
                results[col] = "datetime"
            elif column_data.nunique() < 20:
                results[col] = "categorical"
            else:
                results[col] = "text"

    return results

def improve_column_names(df: pd.DataFrame) -> dict:
    improved_names = {}

    for column in df.columns:
        improved_names[column] = " ".join(word.capitalize() for word in column.split("_"))

    return improved_names

def analyze_csv(file_path: str) -> dict:
    df, enc = read_csv(file_path)
    df = clean_csv(df)
    column_types = detect_column_types(df)
    improved_column_names = improve_column_names(df)

    result = {
        "encoding": enc,
        "rows": len(df),
        "numColumns": len(df.columns),
        "columns": df.columns.tolist(),
        "dataTypes": df.dtypes.apply(lambda x: x.name).to_dict(),
        "missingValues": df.isnull().sum().to_dict(),
        "uniqueValues": {col: df[col].nunique() for col in df.columns},
        "columnTypes": column_types,
        "improvedColumnNames": improved_column_names
    }
    
    return result

if __name__ == "__main__":
    file_path = sys.argv[1]
    analysis_result = analyze_csv(file_path)
    print(json.dumps(analysis_result, indent=4))