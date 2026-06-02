/* this file is for handling CSV file uploads using multer. It defines a POST route that accepts a single CSV file, 
saves it to the "uploads" directory, and returns information about the uploaded file in the response. */

import { Router } from "express";
import multer from "multer";
import path from "path";
import { executePythonScript } from "../services/pythonAnalysisService.js";
import fs from "fs/promises";

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

router.post("/detect-columns", upload.single("csv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const analysis = await executePythonScript(
      "detect_column_types",
      req.file.path,
    );

    return res.json({
      message: "CSV uploaded successfully",
      originalName: req.file.originalname,
      analysis: analysis,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      error: "Failed to detect columns",
      details: (err as Error).message,
    });
  } finally {
    await fs.unlink(req.file.path).catch((err) => {
      console.error(`Failed to delete uploaded file: ${err.message}`);
    });
  }
});

router.post("/analyse", upload.single("csv"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    let columnTypes: Record<string, string> = {};

    if (req.body.columnTypes) {
      columnTypes = JSON.parse(req.body.columnTypes);
    }

    const analysis = await executePythonScript(
      "analyze_csv",
      req.file.path,
      columnTypes,
    );

    return res.json({
      message: "CSV uploaded successfully",
      originalName: req.file.originalname,
      analysis: analysis,
    });
  } catch (err: unknown) {
    return res.status(500).json({
      error: "Failed to analyze CSV file",
      details: (err as Error).message,
    });
  } finally {
    await fs.unlink(req.file.path).catch((err) => {
      console.error(`Failed to delete uploaded file: ${err.message}`);
    });
  }
});

export default router;
