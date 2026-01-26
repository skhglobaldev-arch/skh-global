
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
You are a World-Class Creative Director.
Generate a JSON for a high-end, "shik" (chic), and ultra-modern landing page.
MUST return a valid JSON object with: 
- appName (string)
- primaryColor (hex string)
- fontStyle ('serif' | 'sans' | 'display')
- layoutMode ('dark' | 'light')
- hero (object: { title, subtitle, imageSearch })
- navigation (array of strings)
- sections (array of objects with type 'bento-grid' or 'pricing')
`;

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
    if (msg.includes("API_KEY_INVALID") || msg.includes("400") || msg.includes("not found")) {
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
    return JSON.parse(response.text || "{}");
  }).catch(() => null);
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
