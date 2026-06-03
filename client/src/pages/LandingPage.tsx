import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main className="app-shell">
      <section className="container py-5">
        <div className="row align-items-center justify-content-center min-vh-100">
          <div className="col-lg-10">
            <div className="page-card rounded-5 p-4 p-md-5">
              <div className="row align-items-center g-5">
                <div className="col-lg-7">
                  <span className="badge rounded-pill text-bg-primary mb-3 px-3 py-2">
                    CSV Analysis Tool
                  </span>

                  <h1 className="display-4 fw-bold mb-4">
                    Turn messy CSV files into clear, useful insights.
                  </h1>

                  <p className="lead text-muted-soft mb-4">
                    Upload a CSV file, review detected column types, and
                    generate a clean overview of missing values, unique values,
                    duplicates, and data quality issues.
                  </p>

                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <Link to="/upload" className="btn btn-primary btn-lg px-4">
                      Upload CSV
                    </Link>

                    <a
                      href="#features"
                      className="btn btn-outline-secondary btn-lg px-4"
                    >
                      See features
                    </a>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="feature-pill rounded-5 p-4">
                    <h2 className="h5 fw-bold mb-3">What it checks</h2>

                    <div className="d-grid gap-3">
                      <div className="d-flex justify-content-between border-bottom pb-2">
                        <span>Column types</span>
                        <strong>Auto-detected</strong>
                      </div>

                      <div className="d-flex justify-content-between border-bottom pb-2">
                        <span>Missing values</span>
                        <strong>Counted</strong>
                      </div>

                      <div className="d-flex justify-content-between border-bottom pb-2">
                        <span>Duplicate rows</span>
                        <strong>Cleaned</strong>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Uploaded files</span>
                        <strong>Temporary</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="features" className="row g-3 mt-5">
                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Smart type detection</strong>
                    <p className="text-muted-soft small mb-0">
                      Detects numeric, monetary, datetime, categorical, boolean,
                      and text columns.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Editable review step</strong>
                    <p className="text-muted-soft small mb-0">
                      Correct detected column types before generating the final
                      analysis.
                    </p>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="feature-pill rounded-4 p-3 h-100">
                    <strong>Privacy-aware flow</strong>
                    <p className="text-muted-soft small mb-0">
                      Files are processed temporarily and deleted after
                      analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-soft small mt-4 mb-0">
              Built with React, Express, TypeScript, Python, and pandas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
