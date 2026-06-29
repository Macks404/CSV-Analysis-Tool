import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpButton, useAuth } from "@clerk/clerk-react";

function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/upload");
    }
  }, [isSignedIn, navigate]);

  return (
    <main className="app-shell d-flex align-items-center">
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="page-card rounded-5 p-4 p-md-5 mb-5 shadow-sm">
              <div className="row align-items-center g-5">
                <div className="col-lg-7">
                  <div className="hero-badge mb-4 shadow-sm">
                    Professional CSV Analysis
                  </div>

                  <h1
                    className="display-4 fw-bold mb-4"
                    style={{ color: "#020617" }}
                  >
                    Turn messy data into{" "}
                    <span className="text-gradient-primary">
                      clear insights.
                    </span>
                  </h1>

                  <p className="text-size-lg text-muted-soft mb-5 pe-lg-4">
                    Upload your raw CSV files to automatically generate
                    interactive charts, detect data quality issues, and receive
                    an Executive AI Summary to drive your business forward.
                  </p>

                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <SignUpButton mode="modal">
                      <button className="btn btn-primary btn-lg px-5 shadow-sm fw-bold">
                        Get Started for Free
                      </button>
                    </SignUpButton>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="feature-pill rounded-5 p-4 shadow-sm">
                    <div className="d-flex flex-column gap-3">
                      <div className="info-callout d-flex align-items-center p-3 m-0 shadow-sm">
                        <div className="step-number me-3">1</div>
                        <div>
                          <strong
                            className="d-block"
                            style={{ color: "#0f172a" }}
                          >
                            Smart Data Cleaning
                          </strong>
                          <span className="text-size-sm text-muted-soft">
                            Fixes dates, nulls & duplicates
                          </span>
                        </div>
                      </div>

                      <div className="info-callout d-flex align-items-center p-3 m-0 shadow-sm">
                        <div className="step-number me-3">2</div>
                        <div>
                          <strong
                            className="d-block"
                            style={{ color: "#0f172a" }}
                          >
                            Interactive Charts
                          </strong>
                          <span className="text-size-sm text-muted-soft">
                            Easy viewing of trends
                          </span>
                        </div>
                      </div>

                      <div className="info-callout d-flex align-items-center p-3 m-0 shadow-sm">
                        <div className="step-number me-3">3</div>
                        <div>
                          <strong
                            className="d-block"
                            style={{ color: "#0f172a" }}
                          >
                            Business Strategy
                          </strong>
                          <span className="text-size-sm text-muted-soft">
                            Qualitative insights and suggestions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
