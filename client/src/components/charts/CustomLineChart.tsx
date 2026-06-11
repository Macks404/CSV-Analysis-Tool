import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  // State to track which nested chart is currently active (defaults to 0: Daily)
  const [activeIndex, setActiveIndex] = useState(0);

  // Safety check: ensure charts array exists and has data
  if (!chart.charts || chart.charts.length === 0) return null;

  // The currently selected dataset (Daily or Weekly)
  const activeData = chart.charts[activeIndex];

  return (
    <div className="page-card rounded-4 p-4 mb-4">
      {/* Header section with Flexbox to align title and buttons */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
          <p className="text-muted-soft mb-0">{chart.description}</p>
        </div>

        {/* Render toggle buttons if there is more than one timeframe available */}
        {chart.charts.length > 1 && (
          <div className="btn-group">
            {chart.charts.map((subChart, index) => (
              <button
                key={index}
                className={`btn btn-sm ${activeIndex === index ? "btn-primary" : "btn-outline-primary"}`}
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
            data={activeData.data} // Use active dataset
            margin={{ top: 5, right: 5, bottom: 30, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              name={activeData.xColumn} // Use active xColumn
              tickFormatter={dateFormatter}
              label={{
                value: activeData.xColumn,
                position: "bottom",
                dy: 10,
              }}
            />
            <YAxis
              dataKey="y"
              name={activeData.yColumn} // Use active yColumn
              label={{
                value: activeData.yColumn,
                angle: -90,
                position: "left",
                dy: -40,
              }}
            />
            <Tooltip
              labelFormatter={dateFormatter}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Line
              type="monotone"
              dataKey="y"
              name={activeData.name} // E.g., "Daily Average"
              dot={false}
              stroke="#008fd0"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomLineChart;
