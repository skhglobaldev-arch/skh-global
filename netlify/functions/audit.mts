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

type AuditSubmission = {
  name?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  businessTypeLabel?: string;
  volume?: string;
  volumeLabel?: string;
  ticketNumber?: string;
  channels?: string;
  channelsLabel?: string;
  painPoint?: string;
  painPointLabel?: string;
  currentLanguage?: string;
  reviewSummary?: Record<string, string>;
};

const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" }
  });

export default async (request: Request) => {
  if (request.method === "GET") {
    return json({ message: "Audit API is active. Use POST to submit data." });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const submission = (await request.json()) as AuditSubmission;
    if (!submission.email) {
      return json({ error: "Email is required" }, 400);
    }

    const language = normalizeLanguage(submission.currentLanguage);
    const copy = getEmailCopy(language);
    const displayBusinessName = cleanDisplayName(submission.businessName);
    const ticketNumber = submission.ticketNumber || `SKH-${Date.now().toString().slice(-8)}`;
    const siteUrl = (process.env.PUBLIC_SITE_URL || process.env.URL || new URL(request.url).origin).replace(/\/$/, "");
    const review = submission.reviewSummary || {};

    const customerMessage = await generateAutoReply({
      "Business Name": displayBusinessName,
      "Business Type": submission.businessTypeLabel || submission.businessType || "",
      "Main Channels": submission.channelsLabel || submission.channels || "",
      "Biggest Pain Point": submission.painPointLabel || submission.painPoint || "",
      "Monthly Volume": submission.volumeLabel || submission.volume || "",
      "Requested Features": review.systemIncludes || "",
      "Customer Experience Needs": review.customerExperience || "",
      "Admin Panel Needs": review.adminNeeds || "",
      "Sensitive Data": review.sensitiveData || "",
      "Budget": review.budget || "",
      "Timeline": review.timeline || "",
      "Additional Notes": review.finalNotes || "",
      "Customer Name": submission.name || review.name || "",
      "Customer Email": submission.email,
      "Customer Phone": submission.phone || "",
      "Ticket Number": ticketNumber,
      "Language": languageNames[language] || languageNames.en
    });

    const { emailUser, transporter } = createEmailTransporter();
    const internalSummary = Object.entries({
      "Name": submission.name || review.name,
      "Business": displayBusinessName || submission.businessName,
      "Email": submission.email,
      "Website / Social": review.website,
      "Business Type": submission.businessTypeLabel || submission.businessType,
      "Current Workflow": submission.channelsLabel || submission.channels,
      "Workflow Notes": review.currentWorkflowNotes,
      "Main Problem": submission.painPointLabel || submission.painPoint,
      "System Includes": review.systemIncludes,
      "Customer Experience": review.customerExperience,
      "Admin Needs": review.adminNeeds,
      "Sensitive Data": review.sensitiveData,
      "Sensitive Notes": review.sensitiveNotes,
      "Budget": review.budget,
      "Timeline": review.timeline,
      "Final Notes": review.finalNotes,
      "Ticket": ticketNumber,
      "Language": languageNames[language] || language
    })
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    await transporter.sendMail({
      from: `"SKH Global" <${emailUser}>`,
      to: emailUser,
      replyTo: submission.email,
      subject: `New System Review Request: ${displayBusinessName || submission.email} (#${ticketNumber})`,
      text: internalSummary
    });

    await transporter.sendMail({
      from: `"SKH Global" <${emailUser}>`,
      to: submission.email,
      subject: `${copy.subject} - SKH Global`,
      html: renderCustomerEmail({
        title: `${copy.titlePrefix} ${displayBusinessName || copy.genericBusiness}`,
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
    console.error("[NETLIFY-AUDIT] Submission failed", error);
    return json({ error: "Submission Failed" }, 500);
  }
};

export const config = {
  path: "/api/audit"
};
