import { useState } from "react";
import CsvDropZone from "./CSVDropZone.tsx";
import { Navigate, useNavigate } from "react-router-dom";

function CSVUploadForm() {
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  async function handleFileChange(file: File | null) {
    if (!file) {
      setMessage("Only CSV Files Are Accepted!");
      return;
    }
    setMessage("Analyzing File...");

    const formData = new FormData();
    formData.append("csv", file);

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

      setMessage(`Analysis Complete: ${data.originalName}`);
      console.log(data);

      navigate("/analysis", {
        state: { analysis: data.analysis, originalName: data.originalName },
      });
    } catch (error) {
      setMessage("Error occurred while analyzing CSV.");
      console.error(error);
    }
  }

  return <CsvDropZone message={message} onFileChange={handleFileChange} />;
}

export default CSVUploadForm;
