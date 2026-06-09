import { type ChartConfig } from "./chartTypes";
import CorrelationScatterChart from "./CustomScatterChart";
import CustomBarChart from "./CustomBarChart";
import CustomLineChart from "./CustomLineChart";

function ChartRenderer({ chart }: { chart: ChartConfig }) {
  switch (chart.chartType) {
    case "scatter":
      return <CorrelationScatterChart chart={chart} />;
    case "bar":
      return <CustomBarChart chart={chart} />;
    case "line":
      return <CustomLineChart chart={chart} />;
    default:
      return null;
  }
}

export default ChartRenderer;
