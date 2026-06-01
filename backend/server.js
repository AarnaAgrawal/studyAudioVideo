import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

app.post("/generate", async (req, res) => {
  try {
    const notes = req.body.notes;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a podcast-style educational AI.

Return STRICTLY in this format:

TITLE: short engaging title
LENGTH: estimated minutes (number only)
TRANSCRIPT: clear spoken lesson (no markdown, no symbols, no formatting)

Rules:
- Sound like a friendly teacher explaining aloud
- Keep it structured: intro, explanation, example, recap
- No emojis, no bullet points, no markdown

Notes:
${notes}
      `
    });

    const text = result.text;

    const title =
      text.match(/TITLE:\s*(.*)/)?.[1]?.trim() || "Study Lesson";

    const length =
      text.match(/LENGTH:\s*(.*)/)?.[1]?.trim() || "5";

    const transcript =
      text.match(/TRANSCRIPT:\s*([\s\S]*)/)?.[1]?.trim() || text;

    res.json({
      title,
      length,
      transcript,
      cover: `https://picsum.photos/seed/${encodeURIComponent(title)}/500`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
