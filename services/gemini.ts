
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
You are a World-Class Creative Director and UI Architect.
Task: Generate a high-end, ultra-modern "shik" JSON configuration for a landing page.
Aesthetics: Use sophisticated spacing, "Bento" inspired components, and futuristic typography.
MUST return ONLY a valid raw JSON object. NO markdown blocks, NO backticks.

Structure:
{
  "appName": "Brand Name",
  "primaryColor": "#hex (vibrant)",
  "fontStyle": "display",
  "layoutMode": "dark",
  "hero": { "title": "Headline", "subtitle": "Sub-headline", "imageSearch": "keywords" },
  "navigation": ["Vision", "Architecture", "Systems", "Connect"],
  "sections": [
    {
      "type": "bento-grid",
      "title": "Core Ecosystem",
      "items": [
        { "title": "Feature 1", "desc": "Detailed description", "size": "large" },
        { "title": "Feature 2", "desc": "Detailed description", "size": "small" },
        { "title": "Feature 3", "desc": "Detailed description", "size": "small" },
        { "title": "Feature 4", "desc": "Detailed description", "size": "large" }
      ]
    },
    {
      "type": "pricing",
      "title": "Scale Your Vision",
      "plans": [
        { "name": "Basic", "price": "$2,500", "features": ["F1", "F2"], "popular": false },
        { "name": "Enterprise", "price": "$10,000", "features": ["F1", "F2", "F3", "F4"], "popular": true }
      ]
    }
  ]
}
`;

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Remove markdown blocks if present
  cleaned = cleaned.replace(/^```json\s*/, "").replace(/```$/, "");
  return cleaned.trim();
}

async function callWithRetry(fn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = error?.message?.toLowerCase() || "";
    // If the error indicates missing model/access, throw a specific error to trigger key selection
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
    // Instantiate inside the function to get the latest process.env.API_KEY
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
    // Return a beautiful fallback if AI fails
    return {
      appName: "SKH Nexus",
      primaryColor: "#0ea5e9",
      fontStyle: "display",
      layoutMode: "dark",
      hero: {
        title: "The Architecture of Tomorrow",
        subtitle: "Custom-engineered systems for global scale and total automation.",
        imageSearch: "cyberpunk luxury tech"
      },
      navigation: ["Vision", "Architecture", "Systems", "Connect"],
      sections: []
    };
  });
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the official SKH.GLOBAL AI. You are professional, tech-savvy, and help users understand our architectural value." },
      history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "I am connected to the grid. How can I assist with your architecture?";
  } catch (error: any) {
    if (error?.message?.toLowerCase().includes("not found")) return "System synchronization required. Please select your API Key again.";
    return "Neural bridge instability. Please try again in a moment.";
  }
};
