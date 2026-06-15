import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { CorrelationChartData } from "./chartTypes";

// Note: I slightly corrected the spelling of 'Correlation' in the function name
function GetCorrelationLabel(correlation: number) {
  if (correlation > 0.7) return "Strong positive";
  if (correlation > 0.3) return "Moderate positive";
  if (correlation > 0.1) return "Weak positive";
  if (correlation < -0.7) return "Strong negative";
  if (correlation < -0.3) return "Moderate negative";
  if (correlation < -0.1) return "Weak negative";
  return "None";
}

function CorrelationScatterChart({ chart }: { chart: CorrelationChartData }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      {/* Refactored Header Layout */}
      <div className="mb-4">
        {/* Top Row: Title and Correlation Badge */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="h5 fw-bold mb-0">{chart.title}</h2>

          {/* Correlation Strength Badge */}
          <span className="badge bg-light text-primary border px-2 py-1 ms-3 fw-medium">
            {GetCorrelationLabel(chart.correlation)}
          </span>
        </div>

        {/* Elevated AI Insight Block (Matches Bar and Line Charts) */}
        {chart.description && (
          <div className="border-start border-3 border-primary ps-3 py-2 bg-light rounded-end pe-3 mb-3">
            <p className="text-muted mb-0 insight-description">
              {chart.description}
            </p>
          </div>
        )}
      </div>

      {/* Refactored Recharts Container using CSS utility class */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 20 }}>
            {/* Kept vertical grid lines for scatter plot readability, but softened the color */}
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              type="number"
              dataKey="x"
              name={chart.xColumn}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: chart.xColumn,
                position: "bottom",
                dy: 10,
                fill: "#9CA3AF",
                fontSize: 14,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name={chart.yColumn}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: chart.yColumn,
                angle: -90,
                position: "insideLeft",
                fill: "#9CA3AF",
                fontSize: 14,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#9CA3AF",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />

            <Scatter
              name={chart.title}
              data={chart.data}
              fill="#008fd0"
              opacity={0.7} /* Slight opacity helps when dots overlap */
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CorrelationScatterChart;
