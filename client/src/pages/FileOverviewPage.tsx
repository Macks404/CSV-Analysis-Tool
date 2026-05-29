import { useLocation } from "react-router-dom";

function FileOverviewPage() {
  const location = useLocation();
  const state = location.state;
  console.log(state);

  return (
    <div>
      <h1>File Overview</h1>
      {state ? (
        <div>
          <h2>Original File Name: {state.data.originalName}</h2>
          <table border={1} cellPadding={5} cellSpacing={0}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc" }}>Column Name</th>
                <th>Column Type</th>
              </tr>
            </thead>
            <tbody>
              {state.data.data.columns.map((col: string, index: number) => (
                <tr key={index} style={{ border: "1px solid #ccc" }}>
                  <td style={{ border: "1px solid #ccc" }}>{col}</td>
                  <td style={{ border: "1px solid #ccc" }}>
                    <select
                      value={state.data.data.columnTypes[col]}
                      style={{
                        width: "100%",
                        padding: "5px",
                        border: "none",
                        fontSize: "14px",
                        backgroundColor: "rgba(255, 255, 255, 0)",
                        fontFamily: "Arial, sans-serif",
                        transition: "border-color 0.3s, background-color 0.3s",
                      }}
                    >
                      <option value="boolean">Boolean</option>
                      <option value="monetary">Monetary</option>
                      <option value="numeric">Numeric</option>
                      <option value="datetime">DateTime</option>
                      <option value="categorical">Categorical</option>
                      <option value="text">Text</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No file data available.</p>
      )}
    </div>
  );
}

export default FileOverviewPage;
