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
    setMessage("Detecting Columns...");

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const response = await fetch("/api/upload/detect-columns", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      navigate("/file-overview", {
        state: { data },
      });
    } catch (error) {
      setMessage("Error occurred while detecting columns.");
      console.error(error);
    }
  }

  return <CsvDropZone message={message} onFileChange={handleFileChange} />;
}

export default CSVUploadForm;
