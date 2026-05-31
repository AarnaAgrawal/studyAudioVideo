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
      You are a friendly, engaging tutor creating a spoken audio lesson.

      RULES:
      - Do NOT use markdown (#, *, -, bullets, or symbols)
      - Do NOT format text
      - Write ONLY plain natural speech
      - Use short sentences
      - Explain like you're speaking to a student
      - Add small pauses using commas and periods only
      - Make it sound like a podcast explanation

      Structure:
      1. Simple introduction
      2. Clear explanation
      3. Example or analogy
      4. Quick recap at the end

      Notes:
      ${notes}
      `
    });

    res.json({
      result: result.text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
