import {
  cleanDisplayName,
  createEmailTransporter,
  generateAutoReply,
  getEmailCopy,
  isRtlLanguage,
  languageNames,
  logoAttachment,
  normalizeLanguage,
  renderCustomerEmail
} from "../../server";

type ContactSubmission = {
  fullName?: string;
  email?: string;
  company?: string;
  investment?: string;
  systemFocus?: string;
  ticketNumber?: string;
  currentLanguage?: string;
};

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" }
  });

export default async (request: Request) => {
  if (request.method === "GET") {
    return json({ message: "Contact API is active. Use POST to submit data." });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const submission = (await request.json()) as ContactSubmission;
    if (!submission.email) {
      return json({ error: "Email is required" }, 400);
    }

    const language = normalizeLanguage(submission.currentLanguage);
    const copy = getEmailCopy(language);
    const displayCompany = cleanDisplayName(submission.company);
    const ticketNumber = submission.ticketNumber || `SKH-${Date.now().toString().slice(-8)}`;
    const siteUrl = (process.env.PUBLIC_SITE_URL || process.env.URL || new URL(request.url).origin).replace(/\/$/, "");
    const { emailUser, transporter } = createEmailTransporter();

    await transporter.sendMail({
      from: `"SKH Global Website" <${emailUser}>`,
      to: emailUser,
      subject: `New Consultation Request: ${displayCompany || "Website Visitor"} (#${ticketNumber})`,
      text: [
        `Name: ${submission.fullName || ""}`,
        `Email: ${submission.email}`,
        `Company: ${displayCompany || submission.company || ""}`,
        `Budget: ${submission.investment || ""}`,
        `Need: ${submission.systemFocus || ""}`,
        `Reference: ${ticketNumber}`
      ].join("\n")
    });

    const customerMessage = await generateAutoReply({
      "Business Name": displayCompany,
      "Business Type": "Consultation request",
      "Main Channels": "Website contact form",
      "Biggest Pain Point": submission.systemFocus || "",
      "Monthly Volume": submission.investment || "",
      "Customer Name": submission.fullName || "",
      "Customer Email": submission.email,
      "Ticket Number": ticketNumber,
      "Language": languageNames[language] || languageNames.en
    });

    await transporter.sendMail({
      from: `"SKH Global" <${emailUser}>`,
      to: submission.email,
      subject: `${copy.subject} - SKH Global`,
      html: renderCustomerEmail({
        title: copy.received,
        preheader: copy.received,
        body: customerMessage,
        ticketNumber,
        offersUrl: `${siteUrl}/#/offers`,
        language,
        direction: isRtlLanguage(language) ? "rtl" : "ltr"
      }),
      attachments: [logoAttachment]
    });

    return json({ success: true, ticketId: ticketNumber });
  } catch (error) {
    console.error("[NETLIFY-CONTACT] Submission failed", error);
    return json({ error: "Submission Failed" }, 500);
  }
};

export const config = {
  path: "/api/contact"
};
