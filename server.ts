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

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV || "development" });
  });

  // API Routes
  app.post("/api/audit", async (req, res) => {
    console.log("Received /api/audit request:", req.body.email);
    const { businessName, email, phone, businessType, volume, ticketNumber, channels, painPoint } = req.body;

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("EMAIL_USER or EMAIL_PASS missing in environment.");
        return res.status(500).json({ error: "Email configuration missing" });
      }

      // 1. Initialize Gemini
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
        1. The Hook: Acknowledge ${businessName} and their presence on ${channels}.
        2. The Diagnostic: Explain why ${painPoint} is a symptom of 'Digital Rental'. Explain that manual handling costs them 20-30% of bookings. Use terms like "Infrastructure", "Bottleneck", "Digital Sovereignty".
        3. The Architectural Solution: Describe the 'Growth Engine' (automated scheduling, deposit collection, CRM) as 'Revenue Architecture'.
        4. The ROI Focus: For a business with ${volume}, the system pays for itself in 60 days.
        5. The Next Step: Do not ask for a sale. Ask for a 10-minute strategy call to 'Review the full Blueprint'.
        
        Tone: Professional, bold, technical, premium. Do not sound like a friendly freelancer. Use Persian.
        Return ONLY the email body text.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();

      // 2. Setup Transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: (process.env.EMAIL_PASS || "").replace(/\s/g, '') // AUTO-FIX: Remove spaces
        }
      });

      // 3. HTML Template
      const logoUrl = "https://files.catbox.moe/n3xbja.png"; 
      
      const htmlTemplate = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
    <style>
        body { font-family: 'Tahoma', 'Arial', sans-serif; background-color: #020617; color: #ffffff; padding: 20px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 30px; padding: 40px; border: 1px solid #1e293b; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { width: 60px; height: 60px; border-radius: 12px; margin-bottom: 20px; }
        .brand { color: #0ea5e9; font-weight: 800; font-size: 24px; letter-spacing: -1px; text-transform: uppercase; font-family: sans-serif; }
        .title { font-size: 28px; font-weight: 900; line-height: 1.1; margin: 20px 0; color: #fff; }
        .stats { display: flex; gap: 10px; margin: 30px 0; direction: ltr; }
        .stat-box { flex: 1; background: #020617; padding: 20px; border-radius: 15px; border: 1px solid #334155; text-align: center; }
        .stat-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 1px; }
        .stat-value { font-size: 20px; font-weight: 800; color: #0ea5e9; margin-top: 5px; }
        .content { color: #f8fafc; line-height: 1.8; font-size: 16px; font-weight: 400; white-space: pre-line; text-align: right; margin-bottom: 30px; }
        .ticket { text-align: center; color: #0ea5e9; font-family: monospace; font-size: 14px; margin-bottom: 20px; font-weight: bold; background: rgba(14, 165, 233, 0.1); padding: 10px; border-radius: 10px; display: inline-block; }
        .btn-wrapper { text-align: center; }
        .btn { display: inline-block; background: #0ea5e9; color: #020617 !important; padding: 18px 40px; border-radius: 15px; font-weight: 800; text-decoration: none; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px; }
        .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #475569; border-top: 1px solid #1e293b; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logoUrl}" alt="SKH" class="logo">
            <div class="brand">SKH GLOBAL</div>
            <h1 class="title">Revenue Audit<br><span style="color:#0ea5e9">Blueprint Ready</span></h1>
            <div class="ticket">TICKET ID: ${ticketNumber}</div>
        </div>
        
        <div class="content">
${aiResponse}
        </div>

        <div class="stats">
            <div class="stat-box">
                <div class="stat-label">Efficiency Gain</div>
                <div class="stat-value">+40%</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">ROI Window</div>
                <div class="stat-value">< 60 Days</div>
            </div>
        </div>

        <div class="btn-wrapper">
            <a href="https://skh.global/offers" class="btn">View Blueprint</a>
        </div>
        
        <div class="footer">
            SKH GLOBAL ARCHITECTURE UNIT – Premium AI Orchestration<br>
            Automating Sovereignty. Building Legacy.<br>
            © 2026 | System Status: ACTIVE | Confidential Transmission
        </div>
    </div>
</body>
</html>
      `;
      
      const clientMailOptions = {
        from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `[Audit Results] ${businessName} - ID: ${ticketNumber}`,
        html: htmlTemplate
      };

      // 4. Send Notification to Admin
      const adminMailOptions = {
        from: `"SKH System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `NEW AUDIT: ${businessName}`,
        text: `New audit request from ${businessName} (${email}). Industry: ${businessType}, Vol: ${volume}. Channels: ${channels}. Pain: ${painPoint}. Ticket: ${ticketNumber}`
      };

      await Promise.all([
        transporter.sendMail(clientMailOptions).catch(err => console.error("Client email fail:", err)),
        transporter.sendMail(adminMailOptions).catch(err => console.error("Admin email fail:", err))
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/contact", async (req, res) => {
     const { fullName, email, company, investment, systemFocus, ticketNumber } = req.body;
     try {
       const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: { 
           user: process.env.EMAIL_USER, 
           pass: (process.env.EMAIL_PASS || "").replace(/\s/g, '') // AUTO-FIX: Remove spaces
         }
       });

       const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #020617; color: #ffffff; padding: 40px; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 30px; padding: 40px; border: 1px solid #1e293b; }
        .header { text-align: center; margin-bottom: 40px; }
        .brand { color: #0ea5e9; font-weight: 800; font-size: 24px; letter-spacing: -1px; text-transform: uppercase; }
        .title { font-size: 32px; font-weight: 900; line-height: 1.1; margin: 20px 0; color: #fff; }
        .content { color: #f8fafc; line-height: 1.8; font-size: 16px; font-weight: 400; }
        .ticket { text-align: center; color: #0ea5e9; font-family: monospace; font-size: 14px; margin-bottom: 20px; font-weight: bold; }
        .btn { display: inline-block; background: #0ea5e9; color: #020617 !important; padding: 18px 30px; border-radius: 12px; font-weight: 800; text-decoration: none; margin-top: 30px; text-transform: uppercase; letter-spacing: 1px; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #475569; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="brand">SKH GLOBAL</div>
            <h1 class="title">SYSTEM INQUIRY<br><span style="color:#0ea5e9">RECEIVED</span></h1>
            <div class="ticket">TICKET ID: ${ticketNumber}</div>
        </div>
        
        <div class="content">
            Hello <strong>${fullName}</strong>,<br><br>
            We have successfully received your inquiry regarding <strong>${company}</strong>. Our architects are reviewing your focus on <strong>${systemFocus}</strong>.
            <br><br>
            Expect a contact from our team shortly to discuss your investment blueprint.
        </div>

        <div class="footer">
            SKH GLOBAL ARCHITECTURE UNIT<br>
            Automating Sovereignty. Building Legacy.<br>
            System Status: ACTIVE
        </div>
    </div>
</body>
</html>
       `;

       const mailOptions = {
         from: `"SKH Architects" <${process.env.EMAIL_USER}>`,
         to: email,
         subject: `[Inquiry Received] ${fullName} - ID: ${ticketNumber}`,
         html: htmlTemplate
       };

       await transporter.sendMail(mailOptions);
       res.status(200).json({ success: true });
     } catch (e) {
       res.status(500).json({ error: "Fail" });
     }
  });

  // Handle missing API routes with a clear error
  app.all("/api/*", (req, res) => {
    console.warn(`404 on API route: ${req.method} ${req.url}`);
    res.status(404).json({ error: "API route not found" });
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
