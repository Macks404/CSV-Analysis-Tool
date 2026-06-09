export interface BaseChart {
  id: string;
  title: string;
  description: string;
}

export interface CorrelationChart extends BaseChart {
  chartType: "scatter";
  xColumn: string;
  yColumn: string;
  correlation: number;
  data: { x: number; y: number }[];
}

export interface BarChartData extends BaseChart {
  chartType: "bar";
  xColumn: string;
  yColumn: string;
  data: { name: string; value: number }[];
}

export interface LineChartData extends BaseChart {
  chartType: "line";
  xColumn: string;
  yColumn: string;
  data: { x: string | number; y: number }[];
}

export type ChartConfig = CorrelationChart | BarChartData | LineChartData;
