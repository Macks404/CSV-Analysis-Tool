import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Ensure your API key is available in your environment variables (.env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function generateAIAnalysis(fullAnalysis: any): Promise<any> {
  try {
    // Extract the EXACT chart titles from the Python output
    const exactChartTitles =
      fullAnalysis.charts?.map((c: any) => c.title) || [];

    // Safety fallback: If a CSV generates 0 charts, we provide a dummy string so the enum doesn't crash
    if (exactChartTitles.length === 0)
      exactChartTitles.push("No charts generated");

    // Initialize the model INSIDE the function so the schema can use our dynamic enum
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: `You are an expert Data Analyst and Strategic Business Advisor. 
I will provide a statistical JSON summary of a dataset. Provide high-level qualitative insights, explain the "so what" for the charts, and offer actionable improvement tips. Do not calculate new math.`,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: {
              type: SchemaType.STRING,
              description:
                "A single sentence summarizing the overall dataset health and main takeaway.",
            },
            chartInsights: {
              type: SchemaType.ARRAY,
              description: "Actionable business logic for each provided chart.",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  chartName: {
                    type: SchemaType.STRING,
                    enum: exactChartTitles, // <-- Forces 100% perfect matching with your frontend
                    description:
                      "You MUST select the exact chart title from the provided list.",
                  },
                  insight: {
                    type: SchemaType.STRING,
                    description:
                      "What this means or how it can be improved. Do not just describe the chart visually.",
                  },
                },
                required: ["chartName", "insight"],
              },
            },
            improvementTips: {
              type: SchemaType.ARRAY,
              description:
                "Tips for improving the positive variables (like profit, retention, etc).",
              items: { type: SchemaType.STRING },
            },
          },
          required: ["summary", "chartInsights", "improvementTips"],
        },
      },
    });

    // 1. Create the "Skinny Payload" to save tokens
    const aiPayload = {
      columns: fullAnalysis.columns,
      missingValues: fullAnalysis.missingValues,
      correlations: fullAnalysis.correlations,
      numericSummaries: fullAnalysis.numericSummaries,
      categoricalSummaries: fullAnalysis.categoricalSummaries,
      timeTrends: fullAnalysis.timeTrends,
      generatedCharts: fullAnalysis.charts?.map((c: any) => ({
        title: c.title,
        type: c.chartType,
      })),
    };

    // 2. Generate content from Gemini
    const result = await model.generateContent(JSON.stringify(aiPayload));

    // 3. Extract the raw string
    const rawText = result.response.text();

    // 4. Parse the string into a structured JSON object and return it
    return JSON.parse(rawText);
  } catch (error) {
    console.error("AI Generation Error:", error);

    // 5. Return a safe fallback OBJECT, not a string, so the frontend .map() doesn't crash
    return {
      summary:
        "AI insights are currently unavailable. Please review the charts below.",
      chartInsights: [],
      improvementTips: [],
    };
  }
}
