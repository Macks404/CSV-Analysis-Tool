import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { CorrelationChart } from "./chartTypes";

function CorrelationScatterChart({ chart }: { chart: CorrelationChart }) {
  return (
    <div className="page-card rounded-4 p-4 mb-4">
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-1">{chart.title}</h2>
        <p className="text-muted-soft mb-0">{chart.description}</p>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name={chart.xColumn}
              label={{
                value: chart.xColumn,
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={chart.yColumn}
              label={{
                value: chart.yColumn,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name={chart.title} data={chart.data} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted-soft small mt-3 mb-0">
        Correlation:{" "}
        {chart.correlation > 0.7
          ? "Strong positive"
          : chart.correlation > 0.3
            ? "Moderate positive"
            : chart.correlation > 0.1
              ? "Weak positive"
              : chart.correlation < -0.7
                ? "Strong negative"
                : chart.correlation < -0.3
                  ? "Moderate negative"
                  : chart.correlation < -0.1
                    ? "Weak negative"
                    : "None"}{" "}
        ({chart.correlation.toFixed(2)})
      </p>
    </div>
  );
}

export default CorrelationScatterChart;
