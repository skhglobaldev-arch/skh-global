import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(express.json());

  // --- API ROUTER ---
  const apiRouter = express.Router();

  // Logging for API only
  apiRouter.use((req, res, next) => {
    console.log(`[API-DEBUG] ${req.method} ${req.url}`);
    next();
  });

  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV || "development" });
  });

  apiRouter.get("/test", (req, res) => {
    res.json({ message: "API is working", time: new Date().toISOString() });
  });

  apiRouter.post("/audit", async (req, res) => {
    console.log("[SERVER] Processing Audit for:", req.body?.email);
    const { businessName, email, phone, businessType, volume, ticketNumber, channels, painPoint } = req.body;

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("EMAIL_USER or EMAIL_PASS missing");
        return res.status(500).json({ error: "Email settings missing" });
      }

      // 1. Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Lead Architectural Strategist for SKH Global. Write a structured response in Farsi (Persian).
        
        Client Details:
        - Business Name: ${businessName}
        - Business Type: ${businessType}
        - Channels: ${channels}
        - Main Pain Point: ${painPoint}
        - Monthly Volume: ${volume}

        Follow this structure precisely:
        1. The Hook
        2. The Diagnostic (Manual work is 'Digital Rental')
        3. The Architectural Solution (Growth Engine)
        4. The ROI Focus
        5. The Next Step (10-min call)
        
        Tone: Professional, bold, technical, premium. Persian language.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // Transporter with aggressive space removal for the password
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, '') // Remove ALL whitespace
        }
      });

      const htmlTemplate = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <style>
        body { font-family: 'Tahoma', sans-serif; background-color: #020617; color: #ffffff; margin: 0; padding: 20px; text-align: right; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 20px; padding: 30px; border: 1px solid #1e293b; }
        .header { text-align: center; margin-bottom: 30px; }
        .brand { color: #0ea5e9; font-weight: 800; font-size: 20px; }
        .title { font-size: 24px; margin: 20px 0; }
        .content { line-height: 1.6; white-space: pre-line; margin-bottom: 30px; }
        .ticket { background: rgba(14, 165, 233, 0.1); padding: 10px; border-radius: 8px; color: #0ea5e9; font-family: monospace; display: inline-block; }
        .btn { display: inline-block; background: #0ea5e9; color: #020617 !important; padding: 15px 30px; border-radius: 10px; font-weight: 800; text-decoration: none; }
        .footer { text-align: center; margin-top: 30px; font-size: 10px; color: #475569; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand">SKH GLOBAL</div>
            <h1 class="title">Blueprint Ready</h1>
            <div class="ticket">ID: ${ticketNumber}</div>
        </div>
        <div class="content">${aiResponse}</div>
        <div style="text-align: center;">
            <a href="https://skh.global/offers" class="btn">View Blueprint</a>
        </div>
        <div class="footer">SKH GLOBAL © 2026</div>
    </div>
</body>
</html>`;

      const mailOptions = {
        from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[Audit Results] ${businessName}`,
        html: htmlTemplate
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("[API ERROR]", error);
      res.status(500).json({ error: "Internal Error" });
    }
  });

  apiRouter.post("/contact", async (req, res) => {
    const { fullName, email, company, ticketNumber } = req.body;
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: (process.env.EMAIL_PASS || "").replace(/\s+/g, '')
        }
      });
      await transporter.sendMail({
        from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Inquiry Received - ${ticketNumber}`,
        text: `Hello ${fullName}, we received your inquiry for ${company}.`
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Fail" });
    }
  });

  // Use the router for ALL /api requests
  app.use("/api", apiRouter);

  // 404 for any other /api routes
  app.all("/api/*", (req, res) => {
    console.warn(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ error: "API Endpoint Not Found" });
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
