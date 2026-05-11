import { useState } from "react";

function App() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  async function handleFileChange() {
    if (!csvFile) {
      setMessage("Please select a CSV file.");
      return;
    }
    setMessage("File selected for analysis.");

    const formData = new FormData();
    formData.append("csv", csvFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${data.error || "Unknown error occurred."}`);
        return;
      }

      setMessage(`Uploaded successfully: ${data.originalName}`);

      console.log(data);
    } catch (error) {
      setMessage("Error occurred while analyzing CSV.");
      console.error(error);
    }
  }

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Choose a CSV file
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
        />
        <button className="btn btn-primary" onClick={handleFileChange}>
          Analyze CSV
        </button>
        {message && <p className="alert alert-info">{message}</p>}
      </div>
    </div>
  );
}

export default App;
