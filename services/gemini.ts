
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION_ADVISOR = `
You are the Lead Solutions Architect at SKH.GLOBAL.
Analyze the user's business idea and provide a technical and strategic plan.
Output a structured response in MARKDOWN:
1. **System Architecture**: Professional breakdown of infrastructure.
2. **Key Features**: High-revenue features tailored to the idea.
3. **Automation Opportunities**: Advanced Make.com or custom Node.js automation logic.
4. **Timeline**: Realistic phase-by-phase roadmap.
5. **Why SKH.GLOBAL**: A persuasive closing call to action.
`;

const SYSTEM_INSTRUCTION_DEMO = `
You are a World-Class Creative Director.
Generate a JSON for a high-end, "shik" (chic), and ultra-modern landing page.
Use high-contrast layouts, Bento grids, and sophisticated color palettes.
JSON Structure:
{
  "appName": "Brand Name",
  "primaryColor": "#hex (vibrant neon or deep luxurious gold/blue)",
  "fontStyle": "display",
  "layoutMode": "dark",
  "hero": { 
    "title": "A powerful 4-6 word headline", 
    "subtitle": "A persuasive sub-headline", 
    "imageSearch": "luxury tech aesthetic" 
  },
  "navigation": ["Services", "Architecture", "Roadmap", "Connect"],
  "sections": [
    {
      "type": "bento-grid",
      "title": "Core Ecosystem",
      "items": [
        { "title": "Neural Logic", "desc": "Autonomous decision engines.", "size": "large" },
        { "title": "Cloud Matrix", "desc": "Infinite scaling via edge computing.", "size": "small" },
        { "title": "Real-time Sync", "desc": "Zero-latency data synchronization.", "size": "small" },
        { "title": "Secure Vault", "desc": "Bank-grade encryption protocols.", "size": "small" }
      ]
    },
    {
      "type": "pricing",
      "title": "Project Scale",
      "plans": [
        { "name": "MVP Genesis", "price": "$5k", "features": ["Core Architecture", "High-End UI", "Standard Automations"], "popular": false },
        { "name": "Empire Elite", "price": "$15k", "features": ["Full Automation", "Global Scalability", "24/7 Priority Ops"], "popular": true }
      ]
    }
  ]
}
`;

/**
 * Helper to handle retries for overloaded models (503) or rate limits (429)
 */
async function callWithRetry(fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error?.message?.includes("503") || error?.message?.includes("429") || error?.message?.includes("overloaded");
    if (isRetryable && retries > 0) {
      console.warn(`Model overloaded. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    if (error?.message?.includes("API key not valid") || error?.message?.includes("400")) {
      throw new Error("AUTH_REQUIRED");
    }
    throw error;
  });
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userIdea,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_DEMO,
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  }).catch(() => null);
};

export const chatWithAI = async (message: string, history: any[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the SKH.GLOBAL official AI. Be elite, professional, and helpful." },
      history: history.map((h: any) => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    return "The communication array is offline. Our engineers are investigating.";
  }
};
