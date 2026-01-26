
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
You are a Senior Creative Director at a top-tier digital agency.
Based on the user's concept, generate a JSON for a ultra-premium landing page.
JSON Structure:
{
  "appName": "Brand Name",
  "primaryColor": "#hex",
  "fontStyle": "sans",
  "layoutMode": "dark",
  "hero": { "title": "Headline", "subtitle": "Sub", "imageSearch": "tech" },
  "sections": []
}
`;

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userIdea,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION_ADVISOR,
        temperature: 0.7 
      },
    });
    return response.text || "Synthesis complete, but buffer was empty.";
  } catch (error: any) {
    console.error("Gemini Project Plan Error:", error);
    return `Analysis failed: ${error?.message || "Internal neural link error"}`;
  }
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  try {
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
  } catch (error) {
    console.error("Visual Demo Error:", error);
    return null;
  }
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
    console.error("Chat Error:", error);
    return "The communication array is offline. Please verify system credentials.";
  }
};
