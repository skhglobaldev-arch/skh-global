
import { GoogleGenAI, Type } from "@google/genai";

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
Based on the user's concept, generate a JSON for a ultra-premium, conversion-focused landing page.
Avoid generic text. Use high-impact business terminology.

JSON Structure:
{
  "appName": "The Brand Name",
  "primaryColor": "A premium hex code reflecting the brand identity",
  "fontStyle": "serif" | "sans" | "display",
  "layoutMode": "dark" | "light",
  "hero": {
    "title": "A headline that commands attention",
    "subtitle": "A subheadline that defines the value proposition clearly",
    "imageSearch": "Hyper-specific Unsplash search term for high-quality, professional photography"
  },
  "sections": [
    {
      "type": "bento-grid",
      "title": "System Core Capabilities",
      "items": [
        {"title": "Core Perk 1", "desc": "Detailed USP description", "imageSearch": "specific keyword", "size": "large"},
        {"title": "Core Perk 2", "desc": "Detailed USP description", "imageSearch": "specific keyword", "size": "small"},
        {"title": "Core Perk 3", "desc": "Detailed USP description", "imageSearch": "specific keyword", "size": "small"}
      ]
    },
    {
      "type": "showcase",
      "title": "High-Performance Integration",
      "content": "Professional copy about how this system integrates into their business life.",
      "imageSearch": "stunning industrial or lifestyle photography keyword"
    },
    {
      "type": "pricing",
      "title": "Tiered Acquisition Models",
      "plans": [
        {"name": "Standard License", "price": "$1,999", "features": ["Feature Set Alpha", "Cloud Deployment", "Standard Support"]},
        {"name": "Architect Suite", "price": "Custom", "features": ["Full Module Access", "Neural Integration", "Priority 1 Support"], "popular": true}
      ]
    }
  ],
  "navigation": ["Solutions", "Infrastructure", "Investment", "Contact"]
}
Keywords for images must be in English for Unsplash compatibility.
`;

export const generateProjectPlan = async (userIdea: string): Promise<string> => {
  try {
    // Re-instantiate to ensure latest API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Upgraded to Pro for architectural reasoning
      contents: userIdea,
      config: { systemInstruction: SYSTEM_INSTRUCTION_ADVISOR },
    });
    return response.text || "Error generating blueprint.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes("API key not valid") && (window as any).aistudio) {
       await (window as any).aistudio.openSelectKey();
    }
    return "Neural synthesis link failed. Please ensure a valid API Key is selected and try again.";
  }
};

export const generateVisualDemo = async (userIdea: string): Promise<any> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userIdea,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_DEMO,
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Demo Generation Error:", error);
    return null;
  }
};

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', text: string }[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { systemInstruction: "You are the SKH.GLOBAL official AI consultant. Be professional, concise, and helpful." },
      history: history.map(h => ({ role: h.role, parts: [{ text: h.text }] }))
    });
    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    return "Communication link interrupted. Please check your credentials.";
  }
};
