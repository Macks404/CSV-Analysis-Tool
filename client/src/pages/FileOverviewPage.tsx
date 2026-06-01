import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function FileOverviewPage() {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  async function handleContinue() {
    try {
      const formData = new FormData();
      formData.append("csv", state.file);
      formData.append(
        "columnTypes",
        JSON.stringify(state.data.analysis.columnTypes),
      );

      const response = await fetch("/api/upload/analyse", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      navigate("/analysis", { state: { data } });
    } catch (error) {
      console.error("Error during analysis:", error);
    }
  }

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
              {state.data.analysis.columns.map((col: string, index: number) => (
                <tr key={index} style={{ border: "1px solid #ccc" }}>
                  <td style={{ border: "1px solid #ccc" }}>{col}</td>
                  <td style={{ border: "1px solid #ccc" }}>
                    <select
                      value={state.data.analysis.columnTypes[col]}
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

      <button onClick={handleContinue}>Continue Analysis</button>
    </div>
  );
}

export default FileOverviewPage;
