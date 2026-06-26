import { Link, NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {
  return (
    <header className="py-3 border-bottom bg-white shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none fw-bold text-dark fs-5">
          CSV Insight
        </Link>

        <nav className="d-flex align-items-center gap-4 small">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-sm px-4 fw-bold">
                Log in
              </button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
