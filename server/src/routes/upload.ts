/* this file is for handling CSV file uploads using multer. It defines a POST route that accepts a single CSV file, 
saves it to the "uploads" directory, and returns information about the uploaded file in the response. */

import { Router } from "express";
import multer from "multer";
import path from "path";
import { analyseCsvWithPython } from "../services/pythonAnalysisService.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".csv") {
      return cb(new Error("Only CSV files are allowed"));
    }

    cb(null, true);
  },
});

router.post("/", upload.single("csv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  let analysis;
  try {
    analysis = await analyseCsvWithPython(req.file.path);
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: "Failed to analyze CSV file", details: err.message });
  }

  res.json({
    message: "CSV uploaded successfully",
    originalName: req.file.originalname,
    analysis: analysis,
  });
});

export default router;
