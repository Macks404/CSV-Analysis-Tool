import { Link, useLocation } from "react-router-dom";

interface CSVAnalysis {
  rows: number;
  numColumns: number;
  columns: string[];
  dataTypes: string[];
  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
  columnTypes: Record<string, string>;
}

interface AnalysisPageState {
  analysis: CSVAnalysis;
  originalName: string;
}

function AnalyzePage() {
  const location = useLocation();
  const state = location.state as AnalysisPageState;

  console.log(state);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fs-2">
        Analysis of file: {state.originalName}
      </h1>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Column</th>
              <th scope="col">Type</th>
              <th scope="col">Missing Values</th>
              <th scope="col">Unique Values</th>
            </tr>
          </thead>

          <tbody>
            {state.analysis.columns.map((column) => (
              <tr key={column}>
                <td>{column}</td>
                <td>{state.analysis.columnTypes[column]}</td>
                <td>{state.analysis.missingValues[column]}</td>
                <td>{state.analysis.uniqueValues[column]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyzePage;
