import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { LineChartData } from "./chartTypes";

function CustomLineChart({ chart }: { chart: LineChartData }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
        <p className="text-muted-soft mb-0">{chart.description}</p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart data={chart.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              name={chart.xColumn}
              label={{
                value: chart.xColumn,
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              dataKey="y"
              name={chart.yColumn}
              label={{
                value: chart.yColumn,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Line type="monotone" dataKey="y" name={chart.title} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomLineChart;
