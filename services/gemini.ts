
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION_ADVISOR = `
You are the Lead Solutions Architect at SKH.GLOBAL.
Analyze the user's business idea and provide a technical and strategic plan.
Output a structured response in MARKDOWN.
1. **System Architecture**: Professional breakdown of infrastructure (Backend, Frontend, Cloud, DB).
2. **Key Features**: High-revenue features tailored to the idea.
3. **Monetization & Scaling**: How to turn this into a million-dollar system.
4. **Timeline**: Realistic phase-by-phase roadmap.
`;

const SYSTEM_INSTRUCTION_DEMO = `
You are a World-Class Creative Director. 
Task: Generate a UNIQUE "shik" JSON config for a website based on the user's idea.
Rules:
1. Identify the site category: 'e-commerce', 'saas', 'luxury-brand', or 'dashboard'.
2. Use sophisticated spacing and modern UI trends (Glassmorphism, Bento-Grids, or Minimalist Luxury).
3. Choose a color palette that matches the industry (e.g., Deep gold/black for luxury, vibrant blue/white for tech).

MUST return ONLY a valid raw JSON object. NO markdown, NO backticks.

Structure:
{
  "siteType": "e-commerce | saas | luxury | dashboard",
  "appName": "Brand Name",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "fontStyle": "serif | sans | display",
  "layoutMode": "dark | light",
  "hero": { 
    "title": "Compelling Headline", 
    "subtitle": "Subtext", 
    "cta": "Action text",
    "imageSearch": "Specific Unsplash keywords for high-quality thematic image" 
  },
  "navigation": ["Nav 1", "Nav 2", "Nav 3"],
  "sections": [
    {
      "type": "bento-grid | products | features | dashboard-preview",
      "title": "Section Title",
      "items": [
        { "title": "Item title", "desc": "Item description", "price": "Optional for e-commerce", "size": "small | large" }
      ]
    }
  ]
}
`;

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/, "").replace(/```$/, "");
  return cleaned.trim();
}

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = error?.message?.toLowerCase() || "";
    if (errorStr.includes("not found") || errorStr.includes("401") || errorStr.includes("invalid")) {
      throw new Error("AUTH_REQUIRED");
    }
    if ((errorStr.includes("503") || errorStr.includes("429") || errorStr.includes("overloaded")) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: userIdea,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
        temperature: 0.8 
      },
    });
    return response.text || "Synthesis complete.";
  });
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userIdea,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_DEMO,
        responseMimeType: "application/json",
      },
    });
    const cleaned = cleanJsonResponse(response.text || "{}");
    return JSON.parse(cleaned);
  }).catch((e) => {
    console.error("Visual generation error:", e);
    return null;
  });
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the official SKH.GLOBAL AI." },
      history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error: any) {
    return "Neural bridge instability. Please try again.";
  }
};
