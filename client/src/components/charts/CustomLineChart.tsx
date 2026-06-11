import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { LineChartData } from "./chartTypes";

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

function CustomLineChart({ chart }: { chart: LineChartData }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
        <p className="text-muted-soft mb-0">{chart.description}</p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <LineChart
            data={chart.data}
            margin={{ top: 5, right: 5, bottom: 30, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              name={chart.xColumn}
              tickFormatter={dateFormatter}
              label={{
                value: chart.xColumn,
                position: "bottom",
                dy: 10,
              }}
            />
            <YAxis
              dataKey="y"
              name={chart.yColumn}
              label={{
                value: chart.yColumn,
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
              name={chart.title}
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
