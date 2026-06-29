import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { BarChartData } from "./chartTypes";

function CustomBarChart({ chart }: { chart: BarChartData }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      <div className="mb-4">
        <h2 className="h5 fw-bold mb-3">{chart.title}</h2>

        {chart.description && (
          <div className="border-start border-3 border-primary ps-3 py-2 bg-light rounded-end pe-3">
            <p className="text-muted mb-0 insight-description">
              {chart.description}
            </p>
          </div>
        )}
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chart.data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              label={{
                value: chart.xColumn,
                position: "insideBottom",
                offset: -10,
                fill: "#9CA3AF",
                fontSize: 14,
              }}
            />

            <YAxis
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
              cursor={{ fill: "rgba(0, 143, 208, 0.05)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />

            <Bar
              dataKey="y"
              name={chart.yColumn}
              fill="#008fd0"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomBarChart;
