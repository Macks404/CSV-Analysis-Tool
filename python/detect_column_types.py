import sys
import pandas as pd
import re
import json

from csv_utils import read_csv, clean_numeric_strings

def is_monetary(column: pd.Series) -> bool:
    non_null_column = column.dropna()

    text_values = non_null_column.astype(str).str.strip()

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
    
    monetary_terms = r"\b(price|cost|value|total|fee|charge|payment|salary|wage|income|revenue|expense|expenses|gross|profit|loss|balance|budget|spend|spending|cash|turnover|sales|sale|earnings|pay|paid|payable|receivable|invoice|billing|bill|tax|vat|gst|discount|refund|credit|debit|deposit|withdrawal|commission|bonus|dividend|interest|principal|premium|rent|loan|debt|equity|asset|liability|capital|margin|markup|fare|rate|subtotal|net|ebitda|ebit)\b"
    # also need terms that prevent false positives
    negative_terms = r"\b(count|number|num|qty|quantity|likes|views|followers|subscribers|comments|shares|clicks|impressions|visits|downloads|ratings|votes|score|points|age|year|duration|days|hours|minutes|seconds|rank|id)\b"

    column_name = str(column.name).replace("_", " ")

    # Can also check if the values are numeric and the column header contains currency related words
    if bool(re.search(monetary_terms, column_name, flags=re.IGNORECASE)) and not bool(re.search(negative_terms, column_name, flags=re.IGNORECASE)):
        numeric_values = pd.to_numeric(clean_numeric_strings(text_values), errors="coerce")
        if numeric_values.notna().mean() > 0.8:
            return True

    return False

def detect_column_types(df) -> dict:
    results = {}

    for col in df.columns:
        column_data = df[col]
        non_null_data = column_data.dropna()

        if non_null_data.empty:
            results[col] = "empty"

        elif pd.api.types.is_bool_dtype(column_data):
            results[col] = "boolean"

        elif is_monetary(column_data):
            results[col] = "monetary"

        elif pd.api.types.is_numeric_dtype(column_data):
            results[col] = "numeric"

        else:
            converted_dates = pd.to_datetime(non_null_data, errors="coerce",format="mixed")
            date_ratio = converted_dates.notna().mean()
            
            if date_ratio > 0.8:
                results[col] = "datetime"
            elif column_data.nunique() < 12:
                results[col] = "categorical"
            else:
                results[col] = "text"

    return results

if __name__ == "__main__":
    file_path = sys.argv[1]

    df, enc = read_csv(file_path)
    column_types = detect_column_types(df)

    output = {
        "columns": df.columns.tolist(),
        "columnTypes": column_types,
    }
    print(json.dumps(output))

