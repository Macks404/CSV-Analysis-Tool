import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { LineChart as LineChartType } from "./chartTypes";

const dateFormatter = (value: any) => {
  if (!value) return "";
  const date = new Date(String(value));
  if (isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function CustomLineChart({ chart }: { chart: LineChartType }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayId, setOverlayId] = useState<string | null>(null);

  if (!chart.charts || chart.charts.length === 0) return null;

  const activeData = chart.charts[activeIndex];
  const relatedCharts = chart.relatedLineCharts || [];

  let overlayData = null;
  let overlayTitle = "";

  if (overlayId) {
    const parentOverlayChart = relatedCharts.find((c) => c.id === overlayId);
    if (parentOverlayChart) {
      overlayTitle = parentOverlayChart.title;
      const matchingTimeframe = parentOverlayChart.charts.find(
        (c) => c.name === activeData.name,
      );
      if (matchingTimeframe) {
        overlayData = matchingTimeframe;
      }
    }
  }

  // --- Merge the data arrays chronologically ---
  let chartData = activeData.data.map((d) => ({ x: d.x, primary: d.y }));

  if (overlayData) {
    const mergedMap = new Map();

    chartData.forEach((d) => mergedMap.set(d.x, d));

    overlayData.data.forEach((d) => {
      if (mergedMap.has(d.x)) {
        mergedMap.get(d.x).overlay = d.y;
      } else {
        mergedMap.set(d.x, { x: d.x, overlay: d.y });
      }
    });

    chartData = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime(),
    );
  }

  return (
    <div className="page-card rounded-4 p-4 mb-4">
      {/* Refactored Header Layout */}
      <div className="mb-4">
        {/* Top Row: Title and Timeframe Toggles */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <h2 className="h5 fw-bold mb-0">{chart.title}</h2>

          {chart.charts.length > 1 && (
            <div className="btn-group shadow-sm d-print-none">
              {chart.charts.map((subChart, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${
                    activeIndex === index
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  {subChart.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {chart.description && (
          <div className="border-start border-3 border-primary ps-3 py-2 bg-light rounded-end pe-3 mb-3">
            <p className="text-muted mb-0 insight-description">
              {chart.description}
            </p>
          </div>
        )}

        {relatedCharts.length > 0 && (
          <div className="d-flex align-items-center bg-light p-2 rounded-3 d-inline-flex border d-print-none">
            <label className="text-muted-soft small me-2 mb-0 fw-medium">
              Overlay:
            </label>
            <select
              className="form-select form-select-sm border-0 bg-transparent py-0 pe-4 shadow-none text-primary fw-medium"
              style={{ cursor: "pointer" }}
              value={overlayId || ""}
              onChange={(e) => setOverlayId(e.target.value || null)}
            >
              <option value="">None</option>
              {relatedCharts.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {rc.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Refactored Recharts Container using CSS utility class */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 30, left: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="x"
              name={activeData.xColumn}
              tickFormatter={dateFormatter}
              minTickGap={30}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: activeData.xColumn,
                position: "bottom",
                dy: 10,
                fill: "#9CA3AF",
                fontSize: 14,
              }}
            />

            <YAxis
              yAxisId="left"
              dataKey="primary"
              name={activeData.yColumn}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: activeData.yColumn,
                angle: -90,
                position: "insideLeft",
                dy: 40,
                fill: "#9CA3AF",
                fontSize: 14,
              }}
            />

            {overlayData && (
              <YAxis
                yAxisId="right"
                orientation="right"
                dataKey="overlay"
                name={overlayData.yColumn}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: overlayData.yColumn,
                  angle: 90,
                  position: "insideRight",
                  dy: 40,
                  fill: "#9CA3AF",
                  fontSize: 14,
                }}
              />
            )}

            <Tooltip
              labelFormatter={dateFormatter}
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

            <Legend verticalAlign="top" height={36} iconType="circle" />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="primary"
              name={chart.title}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#008fd0" }}
              stroke="#008fd0"
              strokeWidth={3}
            />

            {overlayData && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overlay"
                name={overlayTitle}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#ff7300" }}
                stroke="#ff7300"
                strokeWidth={3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomLineChart;
