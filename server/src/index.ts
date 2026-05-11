import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
