import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { BarChartData } from "./chartTypes";

function CustomBarChart({ chart }: { chart: BarChartData }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
        <p className="text-muted-soft mb-0">{chart.description}</p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
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
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="x"
              label={{
                value: chart.xColumn,
                position: "insideBottom",
                offset: -10,
              }}
            />

            <YAxis
              label={{
                value: chart.yColumn,
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />
            <Legend />

            <Bar dataKey="y" name={chart.yColumn} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomBarChart;
