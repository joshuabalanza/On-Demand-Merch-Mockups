import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Support base64 image payloads up to 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialization for Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Analyze Logo endpoint
// Analyzes colors, aesthetic vibes, optimal garment colorways, and photography suggestions
app.post("/api/ai/analyze-logo", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/png" } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 in request body" });
    }

    const ai = getGenAI();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const prompt = `Analyze this brand logo for apparel and on-demand merchandise production.
Return a valid JSON object with the following fields:
{
  "brandVibe": "short 2-4 word description of aesthetic (e.g. Modern Minimalist Tech, Retro Heritage Outdoors, Grungy Streetwear, Artisan Coffee Roaster)",
  "primaryColors": ["#HEX1", "#HEX2"],
  "recommendedGarmentColors": ["#HEX or Color Name", "e.g. Vintage Washed Black", "Heather Grey", "Natural Off-White"],
  "recommendedPrintTechnique": "Direct-to-Garment (DTG) | Screenprint (1-3 spot colors) | Heavy Embroidery | Laser Etch",
  "printTechniqueReason": "1 sentence why this technique fits the logo best",
  "suggestedPhotoScenes": [
    "Scene 1: specific lifestyle product shot prompt",
    "Scene 2: specific model lifestyle photoshoot prompt",
    "Scene 3: close-up texture/detail studio shot prompt"
  ]
}
Return ONLY the raw JSON object, without markdown formatting or code blocks.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      return res.json({ success: true, analysis: parsed });
    } catch {
      // Fallback extract json from text if response has extra wrappers
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return res.json({ success: true, analysis: JSON.parse(jsonMatch[0]) });
      }
      return res.json({ success: true, analysis: { raw: text } });
    }
  } catch (error: any) {
    console.error("Error analyzing logo:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze logo with AI",
    });
  }
});

// AI Generate Custom Product Shot with placed logo
app.post("/api/ai/generate-mockup", async (req, res) => {
  try {
    const {
      prompt,
      logoBase64,
      productName = "T-shirt",
      productColor = "black",
      aspectRatio = "1:1",
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const ai = getGenAI();

    // Construct high-detail studio prompt
    const enhancedPrompt = `Ultra-realistic commercial product photoshoot of a ${productColor} ${productName}. ${prompt}. High-end commercial catalog photography, sharp fabric weave detail, realistic surface lighting and authentic wrinkles, 8k resolution, professional studio lighting.`;

    // Try generating with gemini-3.1-flash-image (or gemini-3.1-flash-lite-image if fallback needed)
    let response;
    const parts: any[] = [];

    if (logoBase64) {
      const cleanBase64 = logoBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64,
        },
      });
      parts.push({
        text: `Incorporate the graphic/logo provided in this reference image prominently and naturally on the ${productName}. ${enhancedPrompt}`,
      });
    } else {
      parts.push({
        text: enhancedPrompt,
      });
    }

    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || "1:1",
            imageSize: "1K",
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("gemini-3.1-flash-image attempt failed, trying gemini-3.1-flash-lite-image:", primaryErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts,
        },
      });
    }

    // Iterate parts to find image
    let imageUrl = "";
    let captionText = "";

    const candidates = response.candidates || [];
    if (candidates.length > 0 && candidates[0].content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "AI model did not return image data in the response.",
        text: captionText,
      });
    }

    return res.json({
      success: true,
      imageUrl,
      caption: captionText,
    });
  } catch (error: any) {
    console.error("Error generating mockup:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate AI mockup",
    });
  }
});

// AI Edit Mockup (prompt to edit / change lighting / scene)
app.post("/api/ai/edit-mockup", async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType = "image/png" } = req.body;
    if (!prompt || !imageBase64) {
      return res.status(400).json({ error: "Missing prompt or imageBase64 in request body" });
    }

    const ai = getGenAI();
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const parts = [
      {
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      },
      {
        text: `Edit this product mockup image: ${prompt}. Retain the product shape and logo placement while modifying the requested details. Photorealistic commercial finish.`,
      },
    ];

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts,
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K",
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("gemini-3.1-flash-image edit attempt failed, trying lite model:", primaryErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts,
        },
      });
    }

    let imageUrl = "";
    let captionText = "";

    const candidates = response.candidates || [];
    if (candidates.length > 0 && candidates[0].content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "AI model did not return edited image data.",
        text: captionText,
      });
    }

    return res.json({
      success: true,
      imageUrl,
      caption: captionText,
    });
  } catch (error: any) {
    console.error("Error editing mockup:", error);
    return res.status(500).json({
      error: error?.message || "Failed to edit mockup with AI",
    });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Merch Mockup Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
