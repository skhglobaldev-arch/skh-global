
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION_ADVISOR = `
You are the Lead Solutions Architect at SKH.GLOBAL.
Analyze the user's business idea and provide a technical and strategic plan.
Output a structured response in MARKDOWN.
1. **System Architecture**: Professional breakdown of infrastructure.
2. **Key Features**: High-revenue features tailored to the idea.
3. **Timeline**: Realistic phase-by-phase roadmap.
`;

const SYSTEM_INSTRUCTION_DEMO = `
You are a World-Class Creative Director and UI Architect.
Task: Generate a high-end, ultra-modern "shik" JSON configuration for a landing page.
Rules:
- Layout: Use sophisticated spacing and "Bento" inspired components.
- Colors: Suggest vibrant neon accents over deep luxurious dark backgrounds.
- MUST return ONLY a valid raw JSON object. NO markdown blocks, NO backticks.

Structure:
{
  "appName": "Brand Name",
  "primaryColor": "#hex",
  "fontStyle": "display",
  "layoutMode": "dark",
  "hero": { "title": "Headline", "subtitle": "Sub-headline", "imageSearch": "keywords" },
  "navigation": ["Services", "Architecture", "Pricing", "Connect"],
  "sections": [
    {
      "type": "bento-grid",
      "title": "Core Ecosystem",
      "items": [
        { "title": "Feature 1", "desc": "Description", "size": "large" },
        { "title": "Feature 2", "desc": "Description", "size": "small" }
      ]
    },
    {
      "type": "pricing",
      "title": "Scale Your Vision",
      "plans": [
        { "name": "Basic", "price": "$1k", "features": ["F1", "F2"], "popular": false },
        { "name": "Enterprise", "price": "$5k", "features": ["F1", "F2", "F3"], "popular": true }
      ]
    }
  ]
}
`;

function cleanJsonResponse(text: string): string {
  // Removes potential markdown code blocks like ```json ... ```
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].toLowerCase().includes("json")) {
      cleaned = lines.slice(1, -1).join("\n");
    } else {
      cleaned = lines.slice(1, -1).join("\n");
    }
  }
  return cleaned.trim();
}

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error).toLowerCase();
    if ((errorStr.includes("503") || errorStr.includes("429") || errorStr.includes("overloaded")) && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  const key = process.env.API_KEY || '';
  if (!key) throw new Error("AUTH_REQUIRED");

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: userIdea,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
        temperature: 0.8 
      },
    });
    return response.text || "Synthesis complete.";
  }).catch(error => {
    const msg = error?.message || "";
    if (msg.includes("401") || msg.includes("API_KEY_INVALID") || msg.includes("400") || msg.includes("not found")) {
      throw new Error("AUTH_REQUIRED");
    }
    throw error;
  });
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  const key = process.env.API_KEY || '';
  if (!key) return null;

  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: key });
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
  }).catch(() => {
    // Fallback static demo if generation fails but we still want to show "something"
    return {
      appName: "Neural Dynamics",
      primaryColor: "#0ea5e9",
      fontStyle: "display",
      layoutMode: "dark",
      hero: {
        title: "The Architecture of Tomorrow",
        subtitle: "Custom systems engineered for global scale.",
        imageSearch: "cyberpunk luxury tech"
      },
      navigation: ["About", "Tech", "Contact"],
      sections: []
    };
  });
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  const key = process.env.API_KEY || '';
  if (!key) return "Please link a valid API Key to use the AI assistant.";

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the SKH.GLOBAL official AI." },
      history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    return "Connection error. Please check your API Key.";
  }
};
