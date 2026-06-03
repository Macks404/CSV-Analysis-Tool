import LandingPage from "./pages/LandingPage.tsx";
import UploadPage from "./pages/UploadPage.tsx";
import AnalyzePage from "./pages/AnalyzePage.tsx";
import FileOverviewPage from "./pages/FileOverviewPage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/analysis" element={<AnalyzePage />} />
      <Route path="/file-overview" element={<FileOverviewPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
