import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

const escapeHtml = (value: string) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const getSmtpUser = () => process.env.SMTP_USER || '';

export const createSmtpTransporter = (): Transporter => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS are not configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const getFromEmail = () => {
  const from = process.env.SYSTEM_REVIEW_FROM_EMAIL || process.env.SMTP_USER;
  if (!from) throw new Error('SYSTEM_REVIEW_FROM_EMAIL is not configured.');
  return from;
};

const getSiteUrl = () => (process.env.SITE_URL || process.env.URL || 'https://skh.global').replace(/\/$/, '');
const getLogoUrl = () => process.env.SKH_LOGO_URL || `${getSiteUrl()}/skh-logo-mark.png`;

const brandedShell = (title: string, bodyHtml: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050713;font-family:Inter,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050713;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:640px;background:rgba(16,24,39,0.95);border:1px solid rgba(56,216,255,0.18);border-radius:24px;overflow:hidden;box-shadow:0 24px 80px rgba(5,7,19,0.55);">
          <tr>
            <td style="padding:28px 28px 12px;text-align:center;background:linear-gradient(180deg,rgba(124,58,237,0.12),transparent);">
              <img src="${escapeHtml(getLogoUrl())}" alt="SKH.GLOBAL" width="64" height="64" style="display:block;margin:0 auto 16px;border-radius:16px;" />
              <div style="display:inline-block;padding:6px 12px;border:1px solid rgba(56,216,255,0.35);border-radius:999px;color:#38D8FF;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">SKH.GLOBAL</div>
              <h1 style="margin:16px 0 0;color:#fff;font-size:24px;line-height:1.3;font-weight:900;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 32px;color:#cbd5e1;font-size:16px;line-height:1.8;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 28px;text-align:center;">
              <a href="${escapeHtml(getSiteUrl())}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB,#38D8FF);color:#fff;text-decoration:none;border-radius:14px;padding:14px 24px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Visit SKH.GLOBAL</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

type MailAttachment = {
  filename: string;
  contentType?: string;
  data: string;
};

const textToHtml = (message: string) =>
  String(message || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');

const toNodemailerAttachments = (attachments: MailAttachment[] = []) =>
  attachments
    .filter((item) => item.filename && item.data)
    .map((item) => ({
      filename: item.filename,
      contentType: item.contentType || undefined,
      content: Buffer.from(item.data, 'base64'),
    }));

const sendHtmlEmail = async (params: { to: string; subject: string; html: string; attachments?: MailAttachment[] }) => {
  const transporter = createSmtpTransporter();
  await transporter.sendMail({
    from: getFromEmail(),
    to: params.to,
    subject: params.subject,
    html: params.html,
    attachments: toNodemailerAttachments(params.attachments),
  });
};

export const sendCustomClientEmail = async (params: {
  to: string;
  subject: string;
  message: string;
  attachments?: MailAttachment[];
}) => {
  const body = `
    ${textToHtml(params.message)}
    <p style="color:#64748b;font-size:14px;">— SKH.GLOBAL Team</p>
  `;

  await sendHtmlEmail({
    to: params.to,
    subject: params.subject,
    html: brandedShell('Message from SKH.GLOBAL', body),
    attachments: params.attachments,
  });
};

export const sendCallBookedEmail = async (params: {
  to: string;
  clientName: string;
  date: string;
  time: string;
  timezone: string;
  ticketNumber?: string;
}) => {
  const body = `
    <p>Hi ${escapeHtml(params.clientName)},</p>
    <p>Your System Review call with SKH.GLOBAL is confirmed.</p>
    <table role="presentation" style="margin:20px 0;width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Date</td><td style="padding:8px 0;color:#fff;font-weight:700;">${escapeHtml(params.date)}</td></tr>
      <tr><td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time</td><td style="padding:8px 0;color:#fff;font-weight:700;">${escapeHtml(params.time)} (${escapeHtml(params.timezone)})</td></tr>
      ${params.ticketNumber ? `<tr><td style="padding:8px 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Reference</td><td style="padding:8px 0;color:#38D8FF;font-weight:700;">${escapeHtml(params.ticketNumber)}</td></tr>` : ''}
    </table>
    <p>We look forward to reviewing your project. If you need to reschedule, reply to this email.</p>
    <p style="color:#64748b;font-size:14px;">— SKH.GLOBAL Team</p>
  `;

  await sendHtmlEmail({
    to: params.to,
    subject: 'Your System Review call is booked — SKH.GLOBAL',
    html: brandedShell('Your call is booked', body),
  });
};

export const sendEmailResponseConfirmation = async (params: {
  to: string;
  clientName: string;
  ticketNumber?: string;
}) => {
  const body = `
    <p>Hi ${escapeHtml(params.clientName)},</p>
    <p>Thank you for submitting your System Review request. We have received your answers and our team will review them carefully.</p>
    ${params.ticketNumber ? `<p style="margin:20px 0;padding:14px 18px;border-radius:14px;background:rgba(56,216,255,0.08);border:1px solid rgba(56,216,255,0.2);color:#38D8FF;font-weight:700;">Reference: ${escapeHtml(params.ticketNumber)}</p>` : ''}
    <p>We will respond by email with our initial thoughts and recommended next steps.</p>
    <p style="color:#64748b;font-size:14px;">— SKH.GLOBAL Team</p>
  `;

  await sendHtmlEmail({
    to: params.to,
    subject: 'Your System Review request has been received — SKH.GLOBAL',
    html: brandedShell('Request received', body),
  });
};

export const sendContactConfirmation = async (params: {
  to: string;
  clientName: string;
  ticketNumber?: string;
}) => {
  const body = `
    <p>Hi ${escapeHtml(params.clientName)},</p>
    <p>Thank you for reaching out to SKH.GLOBAL. We have received your consultation request.</p>
    ${params.ticketNumber ? `<p style="margin:20px 0;padding:14px 18px;border-radius:14px;background:rgba(56,216,255,0.08);border:1px solid rgba(56,216,255,0.2);color:#38D8FF;font-weight:700;">Reference: ${escapeHtml(params.ticketNumber)}</p>` : ''}
    <p>Our specialists will review your needs and contact you soon.</p>
    <p style="color:#64748b;font-size:14px;">— SKH.GLOBAL Team</p>
  `;

  await sendHtmlEmail({
    to: params.to,
    subject: 'Your consultation request has been received — SKH.GLOBAL',
    html: brandedShell('Request received', body),
  });
};

export const sendInternalNotification = async (params: {
  subject: string;
  fields: Record<string, string | undefined>;
}) => {
  const adminEmail = process.env.SYSTEM_REVIEW_ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('[SMTP] SYSTEM_REVIEW_ADMIN_EMAIL not set; skipping internal notification.');
    return;
  }

  const rows = Object.entries(params.fields)
    .filter(([, value]) => value)
    .map(([key, value]) => `<tr><td style="padding:8px 12px;color:#94a3b8;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;">${escapeHtml(key)}</td><td style="padding:8px 12px;color:#fff;vertical-align:top;">${escapeHtml(String(value))}</td></tr>`)
    .join('');

  const body = `
    <p style="color:#94a3b8;margin:0 0 16px;">New submission on SKH.GLOBAL</p>
    <table role="presentation" width="100%" style="border-collapse:collapse;">${rows}</table>
    <p style="margin-top:24px;"><a href="${escapeHtml(getSiteUrl())}/#/admin" style="color:#38D8FF;">Open admin dashboard →</a></p>
  `;

  await sendHtmlEmail({
    to: adminEmail,
    subject: params.subject,
    html: brandedShell('Internal notification', body),
  });
};

export const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
