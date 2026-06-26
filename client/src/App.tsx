import LandingPage from "./pages/LandingPage.tsx";
import UploadPage from "./pages/UploadPage.tsx";
import AnalyzePage from "./pages/AnalyzePage.tsx";
import FileOverviewPage from "./pages/FileOverviewPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import Navbar from "./components/Navbar.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/upload"
          element={
            <>
              <SignedIn>
                <UploadPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/file-overview"
          element={
            <>
              <SignedIn>
                <FileOverviewPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/analysis"
          element={
            <>
              <SignedIn>
                <AnalyzePage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
