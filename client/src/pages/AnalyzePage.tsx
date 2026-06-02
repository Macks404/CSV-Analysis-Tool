import { useLocation } from "react-router-dom";

interface CSVAnalysis {
  encoding: string;
  columns: string[];
  improvedColumnNames: Record<string, string>;
  columnTypes: Record<string, string>;

  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
}

function AnalyzePage() {
  const location = useLocation();
  const state = location.state;
  const analysis: CSVAnalysis = state.data.analysis;
  const originalName: string = state.data.originalName;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fs-2">
        Analysis of file: {originalName}
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
            {analysis.columns.map((column) => (
              <tr key={column}>
                <td>{column}</td>
                <td>{analysis.columnTypes[column]}</td>
                <td>{analysis.missingValues[column]}</td>
                <td>{analysis.uniqueValues[column]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyzePage;
