import { Link, useLocation } from "react-router-dom";

interface CSVAnalysis {
  rows: number;
  columns: number;
  columnNames: string[];
  dataTypes: string[];
  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
  columnTypes: Record<string, string>;
}

interface AnalysisPageState {
  analysis: CSVAnalysis;
  originalName: string;
}

function AnalyzePage() {
  const location = useLocation();
  const state = location.state as AnalysisPageState;

  return (
    <div>
      <h1 className="text-center mt-5 fs-2">
        Analysis of file: {state.originalName}
      </h1>
    </div>
  );
}

export default AnalyzePage;
