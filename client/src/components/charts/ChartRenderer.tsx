import { type ChartConfig } from "./chartTypes";
import CorrelationScatterChart from "./CorrelationScatterChart";

function ChartRenderer({ chart }: { chart: ChartConfig }) {
  switch (chart.chartType) {
    case "scatter":
      return <CorrelationScatterChart chart={chart} />;
    case "bar":
    // return <BarChartComponent chart={chart} />;
    case "line":
    // return <LineChartComponent chart={chart} />;
    default:
      return null;
  }
}

export default ChartRenderer;
