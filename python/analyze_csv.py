import sys
import json
import pandas as pd

def analyze_csv(file_path: str):
    print(f"Analyzing CSV file: {file_path}")
    try:
        df = pd.read_csv(file_path)
        summary = {
            "num_rows": len(df),
            "num_columns": len(df.columns),
            "columns": df.columns.tolist(),
            "data_types": df.dtypes.apply(lambda x: x.name).to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "unique_values": {col: df[col].nunique() for col in df.columns}
        }
        print(json.dumps(summary, indent=4))
    except Exception as e:
        print(f"Error occurred while analyzing CSV file: {e}")

analyze_csv(sys.argv[1])