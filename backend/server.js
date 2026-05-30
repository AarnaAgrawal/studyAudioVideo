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

Turn these notes into a clear study lesson. The lesson should be one that can be listened to by audio, so very interesting and engaging.

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
