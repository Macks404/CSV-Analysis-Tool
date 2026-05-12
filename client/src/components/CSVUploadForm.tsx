import { useState } from "react";
import CsvDropZone from "./CSVDropZone.tsx";

function CSVUploadForm() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  async function handleFileChange(file: File | null) {
    setCsvFile(file);

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
    } catch (error) {
      setMessage("Error occurred while analyzing CSV.");
      console.error(error);
    }
  }

  return <CsvDropZone message={message} onFileChange={handleFileChange} />;
}

export default CSVUploadForm;
