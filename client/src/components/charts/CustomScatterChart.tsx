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

function GetCorrolationLabel(correlation: number) {
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
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
        <p className="text-muted-soft mb-0">{chart.description}</p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 5, right: 5, bottom: 30, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name={chart.xColumn}
              label={{
                value: chart.xColumn,
                position: "bottom",
                dy: 10,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={chart.yColumn}
              label={{
                value: chart.yColumn,
                angle: -90,
                dy: -40,
                position: "left",
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name={chart.title} data={chart.data} fill="#636363" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted-soft small mt-3 mb-0">
        Correlation: {GetCorrolationLabel(chart.correlation)}
      </p>
    </div>
  );
}

export default CorrelationScatterChart;
