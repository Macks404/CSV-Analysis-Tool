import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  return (
    <main className="container py-5">
      <div className="page-card rounded-5 p-4 p-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span className="badge rounded-pill text-bg-success mb-3">
              Step 3 of 3
            </span>

            <h1 className="h2 fw-bold mb-2">Analysis results</h1>

            <p className="text-muted-soft mb-0">
              Final overview of detected column types, missing values, and
              unique values.
            </p>
          </div>

          <div className="text-md-end">
            <p className="text-muted-soft small mb-1">File</p>
            <strong>{originalName}</strong>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="feature-pill rounded-4 p-3 h-100">
              <p className="text-muted-soft small mb-1">Encoding</p>
              <strong>{analysis.encoding}</strong>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-pill rounded-4 p-3 h-100">
              <p className="text-muted-soft small mb-1">Columns</p>
              <strong>{analysis.columns.length}</strong>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-pill rounded-4 p-3 h-100">
              <p className="text-muted-soft small mb-1">Total missing values</p>
              <strong>
                {Object.values(analysis.missingValues).reduce(
                  (total, count) => total + count,
                  0,
                )}
              </strong>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Column</th>
                <th scope="col">Type</th>
                <th scope="col">Missing values</th>
                <th scope="col">Unique values</th>
              </tr>
            </thead>

            <tbody>
              {analysis.columns.map((column) => (
                <tr key={column}>
                  <td>
                    <div className="fw-semibold">
                      {analysis.improvedColumnNames[column] ?? column}
                    </div>
                    <div className="text-muted-soft small">{column}</div>
                  </td>

                  <td>
                    <span className="badge rounded-pill text-bg-primary">
                      {analysis.columnTypes[column] ?? "unknown"}
                    </span>
                  </td>

                  <td>{analysis.missingValues[column] ?? 0}</td>
                  <td>{analysis.uniqueValues[column] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
          <p className="text-muted-soft small mb-0">
            Need to correct a detected column type?
          </p>

          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            Made a mistake? Go back
          </button>
        </div>
      </div>
    </main>
  );
}

export default AnalyzePage;
