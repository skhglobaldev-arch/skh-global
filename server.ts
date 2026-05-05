import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors()); // Enable CORS for ALL origins
  
  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // --- DEBUG PING ---
  app.get("/ping", (req, res) => {
    res.send("PONG - Server is reachable");
  });

  // --- API ROUTES ---
  app.post("/api/audit", async (req, res) => {
    console.log("[API-AUDIT] POST request received");
    console.log("[API-AUDIT] Headers:", req.headers['content-type']);
    
    const { businessName, email, phone, businessType, volume, ticketNumber, channels, painPoint } = req.body;

    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, ''); // Fix spaces

      if (!emailUser || !emailPass) {
        console.error("Credentials missing in .env");
        return res.status(500).json({ error: "Server Configuration Error" });
      }

      // 1. Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Lead Architectural Strategist for SKH Global. Write a structured response in Farsi (Persian).
        Client Details: ${businessName}, ${businessType}, ${channels}, ${painPoint}, ${volume}.
        Structure: 1. Hook, 2. Diagnostic, 3. Solution, 4. ROI, 5. Call to action.
        Tone: Professional, premium. Farsi lang.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // 2. Transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });

      const htmlTemplate = `
        <div style="direction: rtl; text-align: right; background: #020617; color: white; padding: 40px; font-family: sans-serif; border-radius: 20px;">
          <h1 style="color: #0ea5e9;">گزارش استراتژیک SKH GLOBAL</h1>
          <p style="white-space: pre-line;">${aiResponse}</p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;">
          <div style="text-align: center;">
            <a href="https://skh.global/offers" style="background: #0ea5e9; color: #020617; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">مشاهده جزئیات سیستم</a>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"SKH Architects" <${emailUser}>`,
        to: email,
        subject: `[نظام اتوماسیون] گزارش بیزنس ${businessName}`,
        html: htmlTemplate
      });

      console.log("[SERVER] Email sent successfully to:", email);
      res.json({ success: true });
    } catch (error) {
      console.error("[SERVER ERROR]", error);
      res.status(500).json({ error: "Submission Failed" });
    }
  });

  // Add a test GET route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is active", env: process.env.NODE_ENV });
  });

  // Catch-all API 404
  app.all("/api/*", (req, res) => {
    console.warn(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ error: "Endpoint Not Found" });
  });

  // Vite middleware for development
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
      // Avoid catching API routes here (handled by the app.all logic above)
      if (req.url.startsWith("/api")) return; 
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
