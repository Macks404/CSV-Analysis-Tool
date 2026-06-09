export interface BaseChart {
  id: string;
  title: string;
  description: string;
}

export interface CorrelationChartData extends BaseChart {
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
  data: { x: string; y: number }[];
}

export interface LineChartData extends BaseChart {
  chartType: "line";
  xColumn: string;
  yColumn: string;
  data: { x: string | number; y: number }[];
}

export type ChartConfig = CorrelationChartData | BarChartData | LineChartData;
