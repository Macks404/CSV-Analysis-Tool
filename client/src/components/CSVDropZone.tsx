import { useState } from "react";

interface CsvDropZoneProps {
  onFileChange: (file: File | null) => void;
  message?: string | null;
}

function CsvDropZone({ message, onFileChange }: CsvDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (!droppedFile) return;
    if (!droppedFile.name.endsWith(".csv")) {
      alert("Please drop a valid CSV file.");
      return;
    }
    onFileChange(droppedFile);
  }

  return (
    <div className="container mt-5">
      <label
        htmlFor="csvFile"
        className={`border border-2 text-center d-flex flex-column justify-content-center rounded-5 ${isDragging ? "border-primary bg-primary bg-opacity-10" : "border-secondary"}`}
        style={{ minHeight: "70vh", cursor: "pointer" }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
      >
        <h1 className="mb-3 fs-3">
          {message ? message : "Drop CSV file here or click to select"}
        </h1>
      </label>
      <input
        id="csvFile"
        type="file"
        accept=".csv"
        className="d-none"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onFileChange(file);
        }}
      />
    </div>
  );
}

export default CsvDropZone;
