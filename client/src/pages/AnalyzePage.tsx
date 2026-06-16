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
  const aiSummary: AISummaryData | undefined = state.data.aiSummary;
  const originalName: string = state.data.originalName;

  console.log(aiSummary);

  return (
    <main className="container py-5">
      <div className="page-card rounded-5 p-4 p-md-5">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between gap-4 mb-5">
          <div className="flex-grow-1">
            <span className="badge rounded-pill text-bg-success mb-3">
              Step 3 of 3
            </span>
            <h1 className="h2 fw-bold mb-2">Analysis results</h1>
            <p className="text-muted-soft mb-4">
              Final overview of detected column types, missing values, and
              unique values.
            </p>

            {/* AI Summary Integrated as Native Lead Text */}
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

        {/* Feature Pills */}
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

        {/* Actionable Recommendations Integrated as Native UI */}
        {aiSummary?.improvementTips && aiSummary.improvementTips.length > 0 && (
          <div className="mb-5">
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

        {/* Charts Section with Embedded Insights */}
        <div>
          <h3 className="h6 fw-bold mb-4 border-bottom pb-2">
            DATA VISUALIZATIONS
          </h3>
          {analysis.charts?.map((chart) => {
            // 1. Find the specific AI insight that matches this chart's title
            const matchedInsight = aiSummary?.chartInsights?.find(
              (insight) => insight.chartName === chart.title,
            );

            // 2. Clone the chart config and inject the AI insight as the description
            const enhancedChartConfig = {
              ...chart,
              // If the AI generated an insight, use it. Otherwise, fall back to the original description.
              description: matchedInsight
                ? matchedInsight.insight
                : chart.description,
            };

            // 3. Pass the freshly enhanced config down to your renderer
            return (
              <ChartRenderer
                key={enhancedChartConfig.id}
                chart={enhancedChartConfig}
              />
            );
          })}
        </div>

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
