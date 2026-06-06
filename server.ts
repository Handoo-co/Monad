import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client with proper configuration from skill guidelines
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Route to generate rich backstory using the Gemini 3.5 Flash text model
  app.post("/api/generate-description", async (req: express.Request, res: express.Response) => {
    try {
      const { productLine, location, briefNotes } = req.body;
      if (!productLine || !location) {
        return res.status(400).json({ error: "Missing productLine or location info" });
      }

      const prompt = `Eres un copywriter experto del ecosistema Web3, marcas de lujo y artesanía heritage para "Handoo".
Handoo es un protocolo en Monad que emite "Pasaportes Digitales de Origen" (OriginPass) para detener falsificaciones a nivel mundial, proveyendo trazabilidad irrefutable on-chain.

Redacta de forma muy elegante, evocadora y profesional en español, la "historia de procedencia, maestría y origen" (máximo 70 palabras) para un producto con esta ficha:
- Línea de producto: ${productLine}
- Ubicación / Origen: ${location}
- Notas de manufactura: ${briefNotes || "Legado local de origen tradicional."}

Destaca la excelencia de la labor manual, el terroir o valor local de la región, y cómo su certificado digital inmutable en el ledger de ultra-alta velocidad Monad garantiza su unicidad y herencia genuina. No uses hashtags, ni modismos informales. Ofrece una pieza de prosa evocadora, limpia e industrial-chic.`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const story = aiResponse.text?.trim() || "";
      return res.json({ story });
    } catch (error: any) {
      console.error("Gemini API route execution failed:", error);
      return res.status(500).json({ error: error.message || "Failed to generate story via Gemini" });
    }
  });

  // Setup Hot Module Replacement, Static files, and standard API fallbacks
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Handoo custom server listening on port ${PORT}`);
  });
}

startServer();
