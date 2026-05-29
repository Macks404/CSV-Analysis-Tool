import { Link, useLocation } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

interface CSVAnalysis {
  encoding: string;
  columns: string[];
  improvedColumnNames: Record<string, string>;
  columnTypes: Record<string, string>;

  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
}

interface AnalysisPageState {
  analysis: CSVAnalysis;
  originalName: string;
}

function AnalyzePage() {
  const location = useLocation();
  const state = location.state as AnalysisPageState;

  // const missingValuesData = Object.entries(state.analysis.missingValues).map(
  //   ([column, missing]) => ({
  //     column,
  //     missing,
  //   }),
  // );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 fs-2">
        Analysis of file: {state.originalName}
      </h1>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">Column</th>
              <th scope="col">Type</th>
              <th scope="col">Missing Values</th>
              <th scope="col">Unique Values</th>
            </tr>
          </thead>

          <tbody>
            {state.analysis.columns.map((column) => (
              <tr key={column}>
                <td>{column}</td>
                <td>{state.analysis.columnTypes[column]}</td>
                <td>{state.analysis.missingValues[column]}</td>
                <td>{state.analysis.uniqueValues[column]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div style={{ width: "60%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={missingValuesData}>
              <XAxis dataKey="column" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="missing" fill="#ff3b58" />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
      </div>
    </div>
  );
}

export default AnalyzePage;
