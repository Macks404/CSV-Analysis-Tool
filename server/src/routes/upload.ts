/* this file is for handling CSV file uploads using multer. It defines a POST route that accepts a single CSV file, 
saves it to the "uploads" directory, and returns information about the uploaded file in the response. */

import { RequestHandler, Router } from "express";
import multer from "multer";
import path from "path";
import { executePythonScript } from "../services/pythonAnalysisService.js";
import { generateAIAnalysis } from "../services/generateAIAnalysis.js";
import fs from "fs/promises";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import prisma from "../prismaClient.js";

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

router.post(
  "/detect-columns",
  ClerkExpressRequireAuth() as any,
  upload.single("csv"),
  async (req, res) => {
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
  },
);

router.post(
  "/analyse",
  ClerkExpressRequireAuth() as any,
  upload.single("csv"),
  async (req, res) => {
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

      const aiSummary = await generateAIAnalysis(analysis);

      // save results to db
      const auth = (req as any).auth;
      const userId = auth?.userId;

      if (userId) {
        const userEmail =
          auth?.claims?.email || `${userId}@clerk-placeholder.com`;

        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: {
            id: userId,
            email: userEmail,
          },
        });

        await prisma.analysis.create({
          data: {
            userId: userId,
            fileName: req.file.originalname,
            summaryText:
              typeof aiSummary === "string"
                ? aiSummary
                : JSON.stringify(aiSummary),
            chartData: analysis as any,
          },
        });
      }

      return res.json({
        message: "CSV uploaded successfully",
        originalName: req.file.originalname,
        analysis: analysis,
        aiSummary: aiSummary,
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
  },
);

router.get("/history", ClerkExpressRequireAuth() as any, async (req, res) => {
  try {
    //@ts-ignore
    const userId = req.auth.userId;

    const analyses = await prisma.analysis.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(analyses);
  } catch (err: unknown) {
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
