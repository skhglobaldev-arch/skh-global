
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION_ADVISOR = `
You are the Lead Solutions Architect at SKH.GLOBAL.
Analyze the user's business idea and provide a technical and strategic plan.
Output a structured response in MARKDOWN.
1. **System Architecture**: High-level infrastructure breakdown.
2. **Revenue Strategy**: How this system generates and scales profit.
3. **Execution Roadmap**: Week-by-week delivery phases.
`;

const SYSTEM_INSTRUCTION_DEMO = `
You are a Visionary Creative Director and UI Architect.
Task: Generate an ultra-high-end "Shik" (Chic) JSON for a bespoke landing page.
Aesthetics: Cyber-luxury, minimalist but high-impact, deep shadows, vibrant accents.
Layout: Experimental, uses "Bento-Grid" and asymmetric sections.

MUST return a valid raw JSON object ONLY. No markdown, no commentary.

Structure:
{
  "appName": "Premium Brand Name",
  "primaryColor": "#hex (vibrant)",
  "fontStyle": "display",
  "layoutMode": "dark",
  "hero": { 
    "title": "A short, punchy 3-4 word headline", 
    "subtitle": "An elegant, descriptive 1-sentence value proposition", 
    "imageSearch": "keywords for high-end visuals" 
  },
  "navigation": ["Vision", "Technology", "Investment", "Initialize"],
  "sections": [
    {
      "type": "bento-grid",
      "title": "The Neural Network",
      "items": [
        { "title": "Precision Scaling", "desc": "Autonomous algorithms that grow with your user base.", "size": "large" },
        { "title": "Zero Latency", "desc": "Edge-computed interactions.", "size": "small" },
        { "title": "Bank-Grade", "desc": "Encrypted to the core.", "size": "small" },
        { "title": "Smart Logic", "desc": "AI that predicts user behavior.", "size": "large" }
      ]
    },
    {
      "type": "pricing",
      "title": "Select Tier",
      "plans": [
        { "name": "Foundations", "price": "$2,500", "features": ["Core Architecture", "Real-time Sync", "Basic Support"], "popular": false },
        { "name": "Ecosystem", "price": "$7,500", "features": ["Full Automation", "AI Integration", "Priority 24/7", "Custom Dashboard"], "popular": true }
      ]
    }
  ]
}
`;

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    cleaned = lines.filter(line => !line.trim().startsWith("```")).join("\n");
  }
  return cleaned.trim();
}

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = error?.message?.toLowerCase() || "";
    if (errorStr.includes("requested entity was not found")) {
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
        temperature: 0.9 
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
    console.error("Visual gen failed:", e);
    return null;
  });
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the SKH.GLOBAL official AI Assistant." },
      history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes("not found")) return "System re-authorization required. Please refresh or update API settings.";
    return "Neural bridge instability detected. Please try again.";
  }
};
