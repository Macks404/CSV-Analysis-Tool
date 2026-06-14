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
  const relatedCharts = activeData.relatedLineCharts || [];

  let overlayData = null;
  let overlayTitle = "";

  // Only one of these blocks is needed!
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

    // 1. Add all primary data points
    chartData.forEach((d) => mergedMap.set(d.x, d));

    // 2. Add or update with overlay data points
    overlayData.data.forEach((d) => {
      if (mergedMap.has(d.x)) {
        mergedMap.get(d.x).overlay = d.y;
      } else {
        mergedMap.set(d.x, { x: d.x, overlay: d.y });
      }
    });

    // 3. Convert back to an array and sort by actual date time
    chartData = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime(),
    );
  }

  return (
    <div className="page-card rounded-4 p-4 mb-4">
      {/* Header section */}
      <div className="mb-3 d-flex justify-content-between align-items-start">
        <div>
          <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
          <p className="text-muted-soft mb-2">{chart.description}</p>

          {/* Compare/Overlay Dropdown */}
          {relatedCharts.length > 0 && (
            <select
              className="form-select form-select-sm w-auto mt-2"
              value={overlayId || ""}
              onChange={(e) => setOverlayId(e.target.value || null)}
            >
              <option value="">Compare with...</option>
              {relatedCharts.map((rc) => (
                <option key={rc.id} value={rc.id}>
                  {rc.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Timeframe Toggles */}
        {chart.charts.length > 1 && (
          <div className="btn-group">
            {chart.charts.map((subChart, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  activeIndex === index ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {subChart.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 30, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              name={activeData.xColumn}
              tickFormatter={dateFormatter}
              minTickGap={30}
              label={{
                value: activeData.xColumn,
                position: "bottom",
                dy: 10,
              }}
            />

            <YAxis
              yAxisId="left"
              dataKey="primary"
              name={activeData.yColumn}
              label={{
                value: activeData.yColumn,
                angle: -90,
                position: "insideLeft",
                dy: 40,
              }}
            />

            {overlayData && (
              <YAxis
                yAxisId="right"
                orientation="right"
                dataKey="overlay"
                name={overlayData.yColumn}
                label={{
                  value: overlayData.yColumn,
                  angle: 90,
                  position: "insideRight",
                  dy: 40,
                }}
              />
            )}

            <Tooltip
              labelFormatter={dateFormatter}
              cursor={{ strokeDasharray: "3 3" }}
            />

            <Legend verticalAlign="top" height={36} />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="primary"
              name={chart.title}
              dot={false}
              stroke="#008fd0"
              strokeWidth={2}
            />

            {overlayData && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="overlay"
                name={overlayTitle}
                dot={false}
                stroke="#ff7300"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomLineChart;
