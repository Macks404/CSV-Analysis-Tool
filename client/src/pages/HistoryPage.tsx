import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CSVAnalysis, AISummaryData } from "./AnalyzePage";

interface Analysis {
  id: string;
  fileName: string;
  createdAt: string;
  summaryText: string;
  chartData: CSVAnalysis;
}

function HistoryPage() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          "http://localhost:3000/api/upload/history",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history data.");
        }

        const json = await response.json();
        setData(json);
      } catch (err: any) {
        console.error("Error fetching history:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getToken]);

  const getPreviewText = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") return parsed;

      if (parsed && typeof parsed === "object") {
        return (
          parsed.summary ||
          parsed.text ||
          parsed.content ||
          Object.values(parsed)[0]?.toString() ||
          JSON.stringify(parsed)
        );
      }

      return JSON.stringify(parsed);
    } catch {
      return text;
    }
  };

  const handleViewInsights = (item: Analysis) => {
    let parsedSummary: AISummaryData;

    try {
      parsedSummary = JSON.parse(item.summaryText);
    } catch {
      parsedSummary = {
        summary: item.summaryText,
        chartInsights: [],
        improvementTips: [],
      };
    }

    const analyzePayload = {
      originalName: item.fileName,
      analysis: item.chartData,
      aiSummary: parsedSummary,
    };

    navigate("/analysis", { state: { data: analyzePayload } });
  };

  if (loading) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-medium">Retrieving your analyses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger shadow-sm rounded-4" role="alert">
          <h4 className="alert-heading fw-bold">Oops! Something went wrong.</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Please try refreshing the page or check your server connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0" style={{ color: "#0f172a" }}>
          My Analyses
        </h2>
        <Link
          to="/upload"
          className="btn btn-primary fw-medium px-4 rounded-pill shadow-sm"
        >
          + New Analysis
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-5 shadow-sm border border-light">
          <div className="display-1 text-muted mb-3">📊</div>
          <h4 className="fw-bold text-dark">No history found</h4>
          <p className="text-muted mb-4">
            You haven't uploaded any CSVs yet. Let's uncover some insights!
          </p>
          <Link
            to="/upload"
            className="btn btn-outline-primary fw-bold px-5 rounded-pill"
          >
            Upload your first CSV
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {data.map((item) => {
            const preview = getPreviewText(item.summaryText);

            return (
              <div key={item.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden bg-white"
                  style={{
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.classList.replace("shadow-sm", "shadow");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.classList.replace("shadow", "shadow-sm");
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        📄
                      </div>
                      <div>
                        <h5
                          className="card-title fw-bold text-dark mb-0 text-truncate"
                          style={{ maxWidth: "200px" }}
                          title={item.fileName}
                        >
                          {item.fileName}
                        </h5>
                        <small className="text-muted fw-medium">
                          {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(item.createdAt))}
                        </small>
                      </div>
                    </div>

                    <p
                      className="card-text text-secondary"
                      style={{ fontSize: "0.95rem", lineHeight: "1.6" }}
                    >
                      {preview.substring(0, 120)}
                      {preview.length > 120 ? (
                        <span className="text-primary">...read more</span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>

                  <div className="card-footer bg-transparent border-top p-3 text-center">
                    <button
                      className="btn btn-light w-100 fw-bold text-primary rounded-pill"
                      onClick={() => handleViewInsights(item)}
                    >
                      View Insights
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
