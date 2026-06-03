import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const isLoggedIn = false;

  return (
    <header className="py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none fw-bold text-dark">
          CSV Insight
        </Link>

        <nav className="d-flex align-items-center gap-4 small">
          <NavLink to="/upload" className="nav-minimal-link">
            Upload
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/analysis-history" className="nav-minimal-link">
              History
            </NavLink>
          )}

          {isLoggedIn ? (
            <NavLink to="/account" className="nav-minimal-link">
              Account
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-minimal-link">
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
