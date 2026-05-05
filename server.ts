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

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(), 
      env: process.env.NODE_ENV,
      email_config: !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS,
      gemini_config: !!process.env.GEMINI_API_KEY
    });
  });

  // GET route for /api/audit to test reachability from browser
  app.get("/api/audit", (req, res) => {
    res.json({ message: "Audit API is active. Use POST to submit data." });
  });

  app.get("/api/contact", (req, res) => {
    res.json({ message: "Contact API is active. Use POST to submit data." });
  });

  // --- API ROUTES ---
  app.post("/api/audit", async (req, res) => {
    console.log(`[API-AUDIT] POST received at ${new Date().toISOString()}`);
    console.log("[API-AUDIT] Headers:", JSON.stringify(req.headers));
    
    const { businessName, email, phone, businessType, volume, ticketNumber, channels, painPoint } = req.body;

    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, ''); // Fix spaces

      if (!emailUser || !emailPass) {
        console.error("[API-AUDIT] Email credentials missing in environment variables");
        return res.status(500).json({ error: "Server Configuration Error: Email credentials not set." });
      }

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      console.log(`[API-AUDIT] Processing for ${businessName} (${email})`);

      // 1. Gemini
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        console.error("[API-AUDIT] GEMINI_API_KEY is missing");
        return res.status(500).json({ error: "Server Configuration Error: AI key not set." });
      }

      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Lead Architectural Strategist for SKH Global. Write a structured response in Farsi (Persian).
        Client Details: 
        Business: ${businessName}
        Type: ${businessType}
        Channels: ${channels}
        Main Problem: ${painPoint}
        Current Volume: ${volume}
        
        Structure: 1. Hook (Immediate attention), 2. Diagnostic (What is failing?), 3. Solution (The SKH Architecture), 4. ROI (Why this pays for itself), 5. Call to action.
        Tone: Professional, premium, technical yet clear.
        Language: Farsi (Persian).
      `;

      console.log("[API-AUDIT] Generating AI response...");
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // 2. Transporter
      console.log("[API-AUDIT] Setting up email transporter...");
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
            <p style="color: #64748b; font-size: 12px; margin-bottom: 20px;">Ticket ID: ${ticketNumber || 'N/A'}</p>
            <a href="https://skh.global/offers" style="background: #0ea5e9; color: #020617; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">مشاهده جزئیات سیستم پیشنهادی</a>
          </div>
        </div>
      `;

      console.log(`[API-AUDIT] Sending mail to ${email}...`);
      await transporter.sendMail({
        from: `"SKH Architects" <${emailUser}>`,
        to: email,
        subject: `[نظام اتوماسیون] گزارش بیزنس ${businessName || 'شما'}`,
        html: htmlTemplate
      });

      console.log("[API-AUDIT] Success. Response sent to client.");
      res.json({ 
        success: true, 
        message: "Audit report generated and sent via email.",
        ticketId: ticketNumber
      });
    } catch (error) {
      console.error("[API-AUDIT] ERROR:", error);
      res.status(500).json({ 
        error: "Submission Failed", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.post("/api/contact", async (req, res) => {
    console.log(`[API-CONTACT] POST received at ${new Date().toISOString()}`);
    const { fullName, email, company, investment, systemFocus, ticketNumber } = req.body;
    
    try {
      const emailUser = process.env.EMAIL_USER;
      const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, '');

      if (!emailUser || !emailPass) {
        console.error("[API-CONTACT] Email credentials missing");
        return res.status(500).json({ error: "Server config error: Email credentials missing." });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });

      const text = `
        New Contact Inquiry:
        Name: ${fullName}
        Email: ${email}
        Company: ${company}
        Investment: ${investment}
        Focus: ${systemFocus}
        Ticket: ${ticketNumber}
      `;

      await transporter.sendMail({
        from: `"SKH Inquiries" <${emailUser}>`,
        to: emailUser, // Send to self
        subject: `New Inquiry: ${company} (#${ticketNumber})`,
        text: text
      });

      console.log("[API-CONTACT] Inquiry email sent.");
      res.json({ success: true });
    } catch (error) {
      console.error("[API-CONTACT] ERROR:", error);
      res.status(500).json({ error: "Contact submission failed" });
    }
  });

  // Catch-all API 404
  app.all("/api/*all", (req, res) => {
    console.warn(`[API-404] ${req.method} ${req.url}`);
    res.status(404).json({ error: "Endpoint Not Found", path: req.url });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[SERVER-FATAL-ERROR]", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
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
    app.get("*all", (req, res) => {
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
