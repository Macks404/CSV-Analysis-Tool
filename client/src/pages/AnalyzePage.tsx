import { useLocation, useNavigate } from "react-router-dom";
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
}

// Your new structured interface
interface AISummaryData {
  summary: string;
  chartInsights: { chartName: string; insight: string }[];
  improvementTips: string[];
}

function AnalyzePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const analysis: CSVAnalysis = state.data.analysis;
  // Strongly type the aiSummary instead of using 'any'
  const aiSummary: AISummaryData | undefined = state.data.aiSummary;
  const originalName: string = state.data.originalName;

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

        {/* --- REFACTORED AI SUMMARY SECTION --- */}
        {aiSummary && (
          <div
            className="info-callout mb-4 p-4 rounded-4"
            style={{ backgroundColor: "rgba(var(--bs-primary-rgb), 0.05)" }}
          >
            <div className="d-flex align-items-center mb-3">
              <span className="me-2 fs-5">✨</span>
              <h2 className="h5 fw-bold mb-0 text-inherit">
                Executive AI Summary
              </h2>
            </div>

            {/* 1. The One-Sentence Summary */}
            <p
              className="lead mb-4"
              style={{ opacity: 0.9, fontSize: "1.05rem" }}
            >
              {aiSummary.summary}
            </p>

            <div className="row g-4">
              {/* 2. Chart Insights */}
              <div className="col-lg-6">
                <h3 className="h6 fw-bold mb-3 text-muted">KEY INSIGHTS</h3>
                <div className="d-flex flex-column gap-3">
                  {aiSummary.chartInsights.map((insight, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-3 shadow-sm"
                    >
                      <strong
                        className="d-block mb-1 text-primary"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {insight.chartName}
                      </strong>
                      <span
                        className="text-muted-soft"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {insight.insight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Improvement Tips */}
              <div className="col-lg-6">
                <h3 className="h6 fw-bold mb-3 text-muted">RECOMMENDATIONS</h3>
                <ul className="list-group list-group-flush rounded-3 overflow-hidden shadow-sm">
                  {aiSummary.improvementTips.map((tip, index) => (
                    <li
                      key={index}
                      className="list-group-item bg-white d-flex align-items-start border-bottom-0 mb-1 rounded-3"
                    >
                      <span className="me-2 mt-1 text-success">✓</span>
                      <span
                        className="text-muted-soft"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Feature Pills */}
        <div className="row g-3 mb-4 mt-2">
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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-5 border-top pt-4">
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
