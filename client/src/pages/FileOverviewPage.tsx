import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

interface ColumnAnalysis {
  columnTypes: Record<string, string>;
  columns: Record<string, string>;
}

function FileOverviewPage() {
  const location = useLocation();

  if (!location.state) {
    return <Navigate to="/upload" replace />;
  }

  const state = location.state;
  const analysis: ColumnAnalysis = state.data.analysis;

  const navigate = useNavigate();
  const [columnTypes, setColumnTypes] = useState(analysis.columnTypes);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { getToken } = useAuth();

  async function handleContinue() {
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("csv", state.file);
      formData.append("columnTypes", JSON.stringify(columnTypes));

      const token = await getToken();

      //const API_BASE_URL = import.meta.env.VITE_API_URL || "";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/analyse`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const data = await response.json();
      console.log(data);

      navigate("/analysis", { state: { data } });
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="container py-5">
      <div className="page-card rounded-5 p-4 p-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span className="badge rounded-pill text-bg-primary mb-3">
              Step 2 of 3
            </span>

            <h1 className="h2 fw-bold mb-2">Review detected columns</h1>

            <p className="text-muted-soft mb-0">
              Check the detected data types before generating the full analysis.
              You can correct anything that looks wrong.
            </p>
          </div>

          <div className="text-md-end">
            <p className="text-muted-soft small mb-1">File</p>
            <strong>{state.data.originalName}</strong>
          </div>
        </div>

        <div className="info-callout mb-4">
          <strong>Tip:</strong> If a column has been detected incorrectly,
          change it here before continuing.
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 analysis-table">
            <thead className="table-light">
              <tr>
                <th scope="col">Column name</th>
                <th scope="col" style={{ width: "260px" }}>
                  Detected type
                </th>
              </tr>
            </thead>

            <tbody>
              {state.data.analysis.columns.map((col: string) => (
                <tr key={col}>
                  <td>
                    <div className="fw-semibold">{col}</div>
                  </td>

                  <td>
                    <select
                      className="form-select analysis-select"
                      value={columnTypes[col] ?? "text"}
                      onChange={(e) => {
                        setColumnTypes({
                          ...columnTypes,
                          [col]: e.target.value,
                        });
                      }}
                    >
                      <option value="boolean">Boolean</option>
                      <option value="monetary">Monetary</option>
                      <option value="numeric">Numeric</option>
                      <option value="datetime">DateTime</option>
                      <option value="categorical">Categorical</option>
                      <option value="text">Text</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
          <p className="text-muted-soft small mb-0">
            These choices will be used to clean values and generate the final
            analysis.
          </p>

          <button
            className="btn btn-primary px-4"
            onClick={handleContinue}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Continue analysis"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default FileOverviewPage;
