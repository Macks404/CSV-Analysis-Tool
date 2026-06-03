import CSVDropZone from "../components/CSVDropZone.tsx";

function UploadPage() {
  return (
    <>
      <h1 className="text-center mt-5">Analyze CSV File</h1>
      <CSVDropZone />
    </>
  );
}

export default UploadPage;
