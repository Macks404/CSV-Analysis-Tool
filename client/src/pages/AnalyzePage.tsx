import { useLocation, useNavigate, Navigate } from "react-router-dom";
import ChartRenderer from "../components/charts/ChartRenderer";
import type { ChartConfig } from "../components/charts/chartTypes";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface CSVAnalysis {
  encoding: string;
  columns: string[];
  improvedColumnNames: Record<string, string>;
  columnTypes: Record<string, string>;
  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
  charts?: ChartConfig[];
}

interface AISummaryData {
  summary: string;
  chartInsights: { chartName: string; insight: string }[];
  improvementTips: string[];
}

function AnalyzePage() {
  const location = useLocation();

  if (!location.state) {
    return <Navigate to="/upload" replace />;
  }

  const navigate = useNavigate();
  const state = location.state;
  const contentRef = useRef<HTMLDivElement>(null);

  const analysis: CSVAnalysis = state.data.analysis;
  const aiSummary: AISummaryData | undefined = state.data.aiSummary;
  const originalName: string = state.data.originalName;

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${originalName.replace(".csv", "")}_Analysis_Report`,
  });

  return (
    <main className="container py-5">
      <div className="page-card rounded-5 p-4 p-md-5">
        <div ref={contentRef} className="print-container p-md-3">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-4 mb-5">
            <div className="flex-grow-1">
              <span className="badge rounded-pill text-bg-success mb-3 d-print-none">
                Step 3 of 3
              </span>
              <h1 className="h2 fw-bold mb-2">Analysis results</h1>

              <p className="text-muted-soft mb-4 d-print-none">
                Final overview of detected column types, missing values, and
                unique values.
              </p>

              {aiSummary?.summary && (
                <div className="border-start border-4 border-primary ps-3 py-1">
                  <p className="lead fw-medium text-dark mb-0 text-size-lg">
                    {aiSummary.summary}
                  </p>
                </div>
              )}
            </div>

            <div className="text-md-end flex-shrink-0">
              <p className="text-muted-soft small mb-1">File</p>
              <strong>{originalName}</strong>
            </div>
          </div>

          <div className="row g-3 mb-5">
            <div className="col-md-4">
              <div className="feature-pill rounded-4 p-3 h-100 bg-light">
                <p className="text-muted-soft small mb-1">Encoding</p>
                <strong>{analysis.encoding}</strong>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-pill rounded-4 p-3 h-100 bg-light">
                <p className="text-muted-soft small mb-1">Columns</p>
                <strong>{analysis.columns.length}</strong>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-pill rounded-4 p-3 h-100 bg-light">
                <p className="text-muted-soft small mb-1">
                  Total missing values
                </p>
                <strong>
                  {Object.values(analysis.missingValues).reduce(
                    (total, count) => total + count,
                    0,
                  )}
                </strong>
              </div>
            </div>
          </div>

          {aiSummary?.improvementTips &&
            aiSummary.improvementTips.length > 0 && (
              <div className="mb-5 keep-together">
                <h3 className="h6 fw-bold mb-3">ACTIONABLE RECOMMENDATIONS</h3>
                <div className="row g-3">
                  {aiSummary.improvementTips.map((tip, index) => (
                    <div key={index} className="col-md-6">
                      <div className="border rounded-4 p-3 h-100 d-flex align-items-start">
                        <span className="me-3 text-primary mt-1">💡</span>
                        <span className="text-dark text-size-sm">{tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="force-new-page">
            <h3 className="h6 fw-bold mb-4 border-bottom pb-2">
              DATA VISUALIZATIONS
            </h3>
            {analysis.charts?.map((chart) => {
              const matchedInsight = aiSummary?.chartInsights?.find(
                (insight) => insight.chartName === chart.title,
              );

              const enhancedChartConfig = {
                ...chart,
                description: matchedInsight
                  ? matchedInsight.insight
                  : chart.description,
              };

              return (
                <div
                  key={enhancedChartConfig.id}
                  className="keep-together mb-5"
                >
                  <ChartRenderer chart={enhancedChartConfig} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mt-5 border-top pt-4">
          <div>
            <h4 className="h6 fw-bold mb-1 text-dark">
              Need to adjust your data?
            </h4>
            <p className="text-muted-soft small mb-0">
              Go back to the overview step to fix incorrect column types or
              adjust settings.
            </p>
          </div>

          <div className="d-flex gap-3 flex-wrap">
            <button
              className="btn btn-outline-secondary px-4 py-2 fw-bold shadow-sm flex-shrink-0 rounded-pill"
              onClick={() => navigate(-1)}
            >
              ← Back to Data Overview
            </button>

            <button
              className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-pill d-flex align-items-center gap-2"
              onClick={() => handlePrint()}
            >
              <span>📄</span> Export to PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AnalyzePage;
