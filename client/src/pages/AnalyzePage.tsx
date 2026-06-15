import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ChartRenderer from "../components/charts/ChartRenderer";
import type { ChartConfig } from "../components/charts/chartTypes";

interface CSVAnalysis {
  encoding: string;
  columns: string[];
  improvedColumnNames: Record<string, string>;
  columnTypes: Record<string, string>;
  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
  charts?: ChartConfig[];
  aiSummary?: string;
}

function AnalyzePage() {
  const location = useLocation();
  const state = location.state;
  const analysis: CSVAnalysis = state.data.analysis;
  const aiSummary: string | undefined =
    state.data.aiSummary || analysis.aiSummary;
  const originalName: string = state.data.originalName;

  const navigate = useNavigate();

  return (
    <main className="container py-5">
      <div className="page-card rounded-5 p-4 p-md-5">
        {/* Header Section */}
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

        {/* --- AI SUMMARY INTEGRATED HERE --- */}
        {aiSummary && (
          <div className="info-callout mb-4">
            <div className="d-flex align-items-center mb-2">
              <span className="me-2 fs-5">✨</span>
              <h2 className="h6 fw-bold mb-0 text-inherit">
                Executive AI Summary
              </h2>
            </div>
            {/* We apply a slight opacity to the markdown text so it blends nicely with the dark blue text of the callout */}
            <div style={{ opacity: 0.9, fontSize: "0.95rem" }}>
              <ReactMarkdown>{aiSummary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Feature Pills */}
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

        {/* Charts */}
        {analysis.charts?.map((chart) => (
          <ChartRenderer key={chart.id} chart={chart} />
        ))}

        {/* Footer */}
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
