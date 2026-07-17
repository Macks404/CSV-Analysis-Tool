import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function CSVDropZone() {
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();

  async function handleFile(file: File | null) {
    if (!file || !file.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please choose a valid CSV file.");
      return;
    }

    setIsLoading(true);
    setMessage("Detecting columns...");

    const formData = new FormData();
    formData.append("csv", file);

    //const API_BASE_URL = import.meta.env.VITE_APP_URL || "";

    try {
      const token = await getToken();

      const response = await fetch(
        `https://csv-analysis-tool.onrender.com/api/upload/detect-columns`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to detect columns.");
        return;
      }

      navigate("/file-overview", {
        state: { data, file },
      });
    } catch (error) {
      setMessage("Something went wrong while reading the file.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  }

  return (
    <main className="app-shell">
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold mb-3">
                Understand your CSV in seconds
              </h1>

              <p className="lead text-muted-soft mb-0">
                Upload a spreadsheet-style CSV and get a clean overview of
                column types, missing values, duplicates, and data quality
                issues.
              </p>
            </div>

            <div className="page-card rounded-5 p-4 p-md-5">
              <label
                htmlFor="csvFile"
                className={`drop-zone-light rounded-4 d-flex flex-column justify-content-center align-items-center text-center p-5 ${
                  isDragging ? "drop-zone-light-active" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
              >
                <div
                  className="rounded-4 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary mb-4"
                  style={{ width: "76px", height: "76px", fontSize: "2rem" }}
                >
                  📄
                </div>

                <h2 className="h3 fw-bold mb-2">
                  {isDragging ? "Drop to upload" : "Drop your CSV here"}
                </h2>

                <p className="text-muted-soft mb-4">
                  or click this panel to browse your computer
                </p>

                <span className="btn btn-primary btn-lg px-4">
                  {message ? message : "Choose CSV file"}
                </span>
              </label>

              <input
                id="csvFile"
                type="file"
                accept=".csv"
                className="d-none"
                disabled={isLoading}
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  handleFile(file);
                  event.target.value = "";
                }}
              />

              <div className="row g-3 mt-4">
                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Smart detection</strong>
                    <p className="text-muted-soft small mb-0">
                      Detects text, dates, numbers, categories, and monetary
                      data.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Column overview</strong>
                    <p className="text-muted-soft small mb-0">
                      See all detected columns with duplicates erased.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Editable results</strong>
                    <p className="text-muted-soft small mb-0">
                      Review and correct detected column types before analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-soft small mt-4 mb-0">
              Files are processed temporarily and are not kept after analysis.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CSVDropZone;
