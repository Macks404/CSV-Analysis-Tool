import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Ensure your API key is available in your environment variables (.env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
  systemInstruction: `You are an expert Data Analyst and Strategic Business Advisor. 
I will provide a statistical JSON summary of a dataset.

YOUR DIRECTIVES:
1. QUALITATIVE INSIGHTS ONLY: Do not attempt to calculate new math. Analyze the provided "timeTrends", "seasonality", "concentration", and "numericSummaries".
2. IDENTIFY BOTTLENECKS & RISKS: Explicitly warn the user if revenue/data is heavily concentrated in one category, or if recent velocity is decelerating.
3. EXPLAIN THE "SO WHAT": Translate strong correlations into business logic (e.g. "Because X correlates with Y, focusing on X will likely drive Y").
4. FORMAT: Write in clean, professional Markdown. Use bolding for key metrics. Do NOT include an introduction or conclusion like "Here is your analysis". Get straight to the bullet points.`,
});

// Pass the full Python analysis object into this function
export async function generateAIAnalysis(fullAnalysis: any): Promise<string> {
  try {
    // 1. Create the "Skinny Payload" to save tokens and prevent overwhelming the AI
    const aiPayload = {
      columns: fullAnalysis.columns,
      missingValues: fullAnalysis.missingValues,
      correlations: fullAnalysis.correlations,
      numericSummaries: fullAnalysis.numericSummaries,
      categoricalSummaries: fullAnalysis.categoricalSummaries,
      timeTrends: fullAnalysis.timeTrends,
      // Map over charts to send ONLY metadata, excluding the massive data arrays
      generatedCharts: fullAnalysis.charts?.map((c: any) => ({
        title: c.title,
        type: c.chartType,
      })),
    };

    // 2. Generate content from Gemini
    const result = await model.generateContent(JSON.stringify(aiPayload));

    // 3. Return the Markdown text
    return result.response.text();
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Return a safe fallback string so the frontend doesn't crash if the API fails
    return "AI insights are currently unavailable. Please review the charts below.";
  }
}
