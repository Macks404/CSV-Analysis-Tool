import pandas as pd

def read_csv(file_path: str) -> tuple: # (DATAFRAME, ENCODING TYPE)
    encodings = ["utf-8", "utf-8-sig", "cp1252", "latin1"]
    error = None
    for encoding in encodings:
        try:
            return pd.read_csv(file_path, encoding=encoding), encoding
        except UnicodeDecodeError as err:
            error = err
    raise ValueError(f"Couldn't read CSV file due to encoding error: {error}")

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