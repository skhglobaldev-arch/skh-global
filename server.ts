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

  app.use(express.json());

  // API Routes
  app.post("/api/audit", async (req, res) => {
    const { businessName, email, phone, businessType, volume, ticketNumber, channels } = req.body;

    try {
      // 1. Initialize Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are the Lead Architect at SKH.GLOBAL. A potential client has requested a Revenue Audit.
        Client Info:
        Business Name: ${businessName}
        Industry: ${businessType}
        Monthly Client Volume: ${volume}
        Current Channels: ${channels}
        
        Generate a professional, high-level structural analysis response (max 150 words). 
        Focus on how AI orchestration can solve bottlenecks for a ${businessType} business. 
        Maintain a bold, technical, and premium tone. Use Persian if the user's name or industry seems Persian, otherwise English.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // 2. Setup Transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // 3. Send Auto-Reply to Client
      const logoUrl = "https://files.catbox.moe/n3xbja.png"; // Official SKH Logo
      
      const clientMailOptions = {
        from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[Audit Initiated] ${businessName} - ID: ${ticketNumber}`,
        html: `
          <div style="background-color: #020617; color: #f8fafc; font-family: sans-serif; padding: 40px; border-radius: 20px;">
            <img src="${logoUrl}" alt="SKH.GLOBAL" style="width: 60px; height: 60px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: #0ea5e9; font-size: 24px; margin-bottom: 10px;">System Diagnostic Initiated</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 30px;">TICKET ID: ${ticketNumber}</p>
            
            <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid #0ea5e9; padding: 20px; margin-bottom: 30px;">
              <p style="font-style: italic; color: #e2e8f0; line-height: 1.6;">
                "${aiResponse}"
              </p>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">
              Our engineers are currently auditing your <b>${businessType}</b> infrastructure. 
              We will contact you via <b>${phone}</b> or this email with your full PDF blueprint.
            </p>
            
            <div style="margin-top: 40px; border-top: 1px solid #1e293b; pt-20px; font-size: 12px; color: #475569;">
              © 2026 SKH.GLOBAL | Premium AI Architecture | System Status: Active
            </div>
          </div>
        `
      };

      // 4. Send Notification to Admin
      const adminMailOptions = {
        from: `"SKH System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `NEW AUDIT: ${businessName}`,
        text: `New audit request from ${businessName} (${email}). Industry: ${businessType}, Vol: ${volume}. Channels: ${channels}. AI Draft: ${aiResponse}`
      };

      await Promise.all([
        transporter.sendMail(clientMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/contact", async (req, res) => {
     // Similar logic for general contact
     const { fullName, email, company, investment, systemFocus, ticketNumber } = req.body;
     try {
       const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
       });

       const mailOptions = {
         from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
         to: email,
         subject: `Inquiry Received - ${fullName}`,
         html: `<h1>System Inquiry Received</h1><p>We are reviewing your request for ${company}. Ticket: ${ticketNumber}</p>`
       };

       await transporter.sendMail(mailOptions);
       res.status(200).json({ success: true });
     } catch (e) {
       res.status(500).json({ error: "Fail" });
     }
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
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
