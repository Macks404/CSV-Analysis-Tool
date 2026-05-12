import UploadPage from "./pages/UploadPage.tsx";
import AnalyzePage from "./pages/AnalyzePage.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UploadPage />} />
      <Route path="/analysis" element={<AnalyzePage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
