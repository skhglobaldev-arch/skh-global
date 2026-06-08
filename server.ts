import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { createSmtpTransporter, getSmtpUser } from "./netlify/functions/lib/mail";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";
import {
  handleAdminRequest,
  handleAuditPost,
  handleAvailabilityGet,
  handleBookSlotPost,
  handleContactPost,
} from "./netlify/functions/lib/handlers";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const escapeHtml = (value: string) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const readAiEmailPrompt = () =>
  fs.readFile(path.join(process.cwd(), "AI_EMAIL_PROMPT.md"), "utf8");

const getSiteUrl = (req?: express.Request) => {
  if (process.env.PUBLIC_SITE_URL) {
    return process.env.PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }

  if (req?.get("host")) {
    return `${req.protocol}://${req.get("host")}`;
  }

  return "https://skh.global";
};

const getOffersUrl = (req?: express.Request) => `${getSiteUrl(req)}/#/offers`;
const logoAttachment = {
  filename: "skh-global-logo.jpeg",
  path: path.join(process.cwd(), "logo.jpeg"),
  cid: "skh-global-logo"
};

const cleanDisplayName = (value?: string) => {
  const cleaned = String(value || "").trim();
  return cleaned && !/test/i.test(cleaned) ? cleaned : "";
};

const normalizeLanguage = (value?: string) => String(value || "en").split("-")[0].toLowerCase();
const isRtlLanguage = (language?: string) => ["ar", "fa", "ur"].includes(normalizeLanguage(language));

const languageNames: Record<string, string> = {
  ar: "Arabic",
  bn: "Bengali",
  de: "German",
  en: "English",
  es: "Spanish",
  fa: "Farsi (Persian)",
  fr: "French",
  hi: "Hindi",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  pt: "Portuguese",
  ru: "Russian",
  sw: "Swahili",
  tr: "Turkish",
  ur: "Urdu",
  zh: "Chinese"
};

const emailUiCopy: Record<string, { button: string; ticket: string; received: string; subject: string; titlePrefix: string; genericBusiness: string }> = {
  ar: { button: "عرض خدماتنا", ticket: "رقم الطلب", received: "تم استلام طلبكم.", subject: "تحليلكم جاهز", titlePrefix: "اقتراحنا الأولي لـ", genericBusiness: "عملكم" },
  bn: { button: "আমাদের সেবা দেখুন", ticket: "রেফারেন্স নম্বর", received: "আপনার অনুরোধ গ্রহণ করা হয়েছে।", subject: "আপনার বিশ্লেষণ প্রস্তুত", titlePrefix: "প্রাথমিক প্রস্তাব:", genericBusiness: "আপনার ব্যবসা" },
  de: { button: "Unsere Leistungen ansehen", ticket: "Referenznummer", received: "Ihre Anfrage wurde empfangen.", subject: "Ihre Analyse ist bereit", titlePrefix: "Erster Vorschlag fuer", genericBusiness: "Ihr Unternehmen" },
  en: { button: "Explore Our Services", ticket: "Reference Number", received: "We have received your request.", subject: "Your analysis is ready", titlePrefix: "Recommended next steps for", genericBusiness: "your business" },
  es: { button: "Ver nuestros servicios", ticket: "Numero de referencia", received: "Hemos recibido su solicitud.", subject: "Su analisis esta listo", titlePrefix: "Propuesta inicial para", genericBusiness: "su negocio" },
  fa: { button: "مشاهده خدمات ما", ticket: "شماره پیگیری", received: "درخواست شما دریافت شد.", subject: "آنالیز شما آماده است", titlePrefix: "پیشنهاد اولیه برای", genericBusiness: "کسب‌وکار شما" },
  fr: { button: "Voir nos services", ticket: "Numero de reference", received: "Votre demande a bien ete recue.", subject: "Votre analyse est prete", titlePrefix: "Premiere proposition pour", genericBusiness: "votre entreprise" },
  hi: { button: "हमारी सेवाएं देखें", ticket: "संदर्भ नंबर", received: "आपका अनुरोध मिल गया है।", subject: "आपका विश्लेषण तैयार है", titlePrefix: "प्रारंभिक सुझाव:", genericBusiness: "आपका व्यवसाय" },
  it: { button: "Scopri i nostri servizi", ticket: "Numero di riferimento", received: "La tua richiesta e stata ricevuta.", subject: "La tua analisi e pronta", titlePrefix: "Prima proposta per", genericBusiness: "la tua azienda" },
  ja: { button: "サービスを見る", ticket: "受付番号", received: "リクエストを受け付けました。", subject: "分析が準備できました", titlePrefix: "最初のご提案：", genericBusiness: "あなたのビジネス" },
  ko: { button: "서비스 보기", ticket: "접수 번호", received: "요청이 접수되었습니다.", subject: "분석이 준비되었습니다", titlePrefix: "첫 제안:", genericBusiness: "귀하의 비즈니스" },
  pt: { button: "Ver os nossos servicos", ticket: "Numero de referencia", received: "Recebemos a sua solicitacao.", subject: "A sua analise esta pronta", titlePrefix: "Primeira proposta para", genericBusiness: "o seu negocio" },
  ru: { button: "Посмотреть наши услуги", ticket: "Номер обращения", received: "Ваш запрос получен.", subject: "Ваш анализ готов", titlePrefix: "Первичное предложение для", genericBusiness: "вашего бизнеса" },
  sw: { button: "Angalia huduma zetu", ticket: "Namba ya kumbukumbu", received: "Ombi lako limepokelewa.", subject: "Uchambuzi wako uko tayari", titlePrefix: "Pendekezo la awali kwa", genericBusiness: "biashara yako" },
  tr: { button: "Hizmetlerimizi gorun", ticket: "Basvuru numarasi", received: "Talebiniz alindi.", subject: "Analiziniz hazir", titlePrefix: "Ilk onerimiz:", genericBusiness: "isletmeniz" },
  ur: { button: "ہماری خدمات دیکھیں", ticket: "حوالہ نمبر", received: "آپ کی درخواست موصول ہو گئی ہے۔", subject: "آپ کا تجزیہ تیار ہے", titlePrefix: "ابتدائی تجویز برائے", genericBusiness: "آپ کا بزنس" },
  zh: { button: "查看我们的服务", ticket: "申请编号", received: "我们已收到您的请求。", subject: "您的分析已准备好", titlePrefix: "初步建议：", genericBusiness: "您的业务" }
};

const getEmailCopy = (language?: string) => emailUiCopy[normalizeLanguage(language)] || emailUiCopy.en;

const sanitizeCustomerEmail = (text: string) =>
  text
    .replace(/Revenue Architecture(s)?/gi, "business system")
    .replace(/Blueprint/gi, "proposal")
    .replace(/Architecture Unit/gi, "Team")
    .replace(/\bartificial intelligence\b/gi, "automation")
    .replace(/\bAI\b/g, "smart");

const buildFallbackAutoReply = (clientData: Record<string, string>) => {
  const language = normalizeLanguage(clientData["Language"]);
  const copy = getEmailCopy(language);
  const businessName = cleanDisplayName(clientData["Business Name"]) || copy.genericBusiness;
  const channels = clientData["Main Channels"] || "کانال‌های فعلی";
  const painPoint = clientData["Biggest Pain Point"] || "فرآیندهای دستی";
  const volume = clientData["Monthly Volume"] || "حجم فعلی درخواست‌ها";

  if (language === "fa") {
    return `سلام،
درخواست شما برای ${businessName} دریافت شد و اطلاعات ثبت‌شده را بررسی کردیم.

با توجه به کانال‌های فعلی شما (${channels}) و موضوعی که مطرح کرده‌اید (${painPoint})، احتمالاً بخشی از زمان شما صرف پیگیری‌ها و کارهای دستی می‌شود.

برای کسب‌وکاری با ${volume}، می‌توانیم راهکاری متناسب شامل رزرو آنلاین، دریافت پرداخت، ثبت درخواست مشتری و پیگیری خودکار طراحی کنیم؛ یا در صورت نیاز، یک نرم‌افزار کامل اختصاصی بسازیم.

کارشناسان ما به‌زودی با شما تماس خواهند گرفت تا نیازتان را دقیق‌تر بررسی کنند و بهترین قدم بعدی را پیشنهاد دهند.

با احترام،
تیم SKH Global`;
  }

  if (language === "fr") {
    return `Bonjour,
Nous avons bien recu la demande d'analyse initiale pour ${businessName}.

Notre premiere lecture indique que votre dependance a ${channels}, combinee a votre enjeu principal (${painPoint}), peut ralentir le suivi commercial et la conversion.

Pour une activite avec ${volume}, nous pouvons mettre en place un systeme adapte : prise de rendez-vous, paiements, suivi client et relances automatisees.

Nos specialistes vous contacteront prochainement afin de comprendre vos besoins et de recommander la prochaine etape la plus utile.

Cordialement,
Equipe SKH Global`;
  }

  if (language === "ar") {
    return `مرحباً،
تم استلام طلب التحليل الاولي الخاص بـ ${businessName}.

تشير مراجعتنا الاولية إلى أن الاعتماد على ${channels} مع التحدي الحالي (${painPoint}) قد يبطئ المتابعة والتحويل.

بالنسبة لعمل بهذا الحجم (${volume})، يمكننا بناء نظام عملي للحجوزات والدفع وتسجيل العملاء والمتابعة الآلية.

سيتواصل معكم خبراؤنا قريباً لفهم احتياجاتكم واقتراح الخطوة المناسبة.

مع التحية،
فريق SKH Global`;
  }

  if (language === "es") {
    return `Hola,
Hemos recibido la solicitud de analisis inicial para ${businessName}.

Nuestra primera lectura indica que depender de ${channels}, junto con el principal bloqueo que describio (${painPoint}), puede estar ralentizando el seguimiento y la conversion.

Para un negocio con ${volume}, podemos crear un sistema practico de reservas, pagos, registro de clientes y seguimiento automatizado.

Nuestros especialistas se pondran en contacto pronto para conocer sus necesidades y recomendar el siguiente paso adecuado.

Saludos,
Equipo SKH Global`;
  }

  if (language === "de") {
    return `Hallo,
wir haben die erste Analyseanfrage fuer ${businessName} erhalten.

Unsere erste Einschaetzung ist, dass die Abhaengigkeit von ${channels} zusammen mit dem beschriebenen Engpass (${painPoint}) Follow-up und Conversion verlangsamen kann.

Fuer ein Unternehmen mit ${volume} koennen wir ein passendes System fuer Termine, Zahlungen, Kundenerfassung und automatische Nachverfolgung entwickeln.

Unsere Spezialisten werden Sie in Kuerze kontaktieren, um Ihren Bedarf zu verstehen und den passenden naechsten Schritt zu empfehlen.

Beste Gruesse,
SKH Global Team`;
  }

  if (language === "pt") {
    return `Ola,
recebemos o pedido de analise inicial para ${businessName}.

A nossa primeira leitura e que depender de ${channels}, juntamente com o principal bloqueio descrito (${painPoint}), pode estar a atrasar o acompanhamento e a conversao.

Para um negocio com ${volume}, podemos criar um sistema pratico para agendamento, pagamentos, registo de clientes e acompanhamento automatico.

Os nossos especialistas entrarao em contacto em breve para entender as suas necessidades e recomendar o proximo passo.

Cumprimentos,
Equipa SKH Global`;
  }

  if (language === "it") {
    return `Ciao,
abbiamo ricevuto la richiesta di analisi iniziale per ${businessName}.

La nostra prima lettura e che dipendere da ${channels}, insieme al principale blocco indicato (${painPoint}), possa rallentare follow-up e conversione.

Per un'attivita con ${volume}, possiamo creare un sistema pratico per prenotazioni, pagamenti, gestione clienti e follow-up automatico.

I nostri specialisti ti contatteranno presto per comprendere le esigenze e consigliare il prossimo passo piu adatto.

Cordiali saluti,
Team SKH Global`;
  }

  if (language === "tr") {
    return `Merhaba,
${businessName} icin ilk analiz talebini aldik.

Ilk degerlendirmemiz, ${channels} kanallarina bagimli kalmanin ve belirttiginiz ana sorunun (${painPoint}) takip ve donusum surecini yavaslatabilecegi yonunde.

${volume} hacmindeki bir isletme icin randevu, odeme, musteri kaydi ve otomatik takip iceren uygun bir sistem kurabiliriz.

Uzmanlarimiz ihtiyacinizi anlamak ve uygun sonraki adimi onermek uzere yakinda sizinle iletisime gececek.

Saygilarimizla,
SKH Global Ekibi`;
  }

  if (language === "ru") {
    return `Здравствуйте,
мы получили первичный запрос на анализ для ${businessName}.

Первичная оценка показывает, что зависимость от ${channels} вместе с указанным узким местом (${painPoint}) может замедлять follow-up и конверсию.

Для бизнеса с объемом ${volume} мы можем создать удобную систему записи, оплаты, учета клиентов и автоматических напоминаний.

Наши специалисты скоро свяжутся с вами, чтобы понять потребности и рекомендовать следующий шаг.

С уважением,
Команда SKH Global`;
  }

  if (language === "zh") {
    return `您好，
我们已收到 ${businessName} 的初步分析请求。

我们的初步判断是，依赖 ${channels}，再加上您描述的主要瓶颈（${painPoint}），可能正在减慢跟进和转化。

对于客户规模为 ${volume} 的业务，我们可以提供预约、付款、客户记录和自动跟进的一体化系统。

我们的专家会尽快与您联系，了解您的需求并建议合适的下一步。

此致，
SKH Global 团队`;
  }

  if (language === "ko") {
    return `안녕하세요,
${businessName}에 대한 초기 분석 요청을 받았습니다.

저희의 첫 판단은 ${channels}에 대한 의존과 말씀하신 주요 병목(${painPoint})이 후속 응대와 전환 속도를 늦출 수 있다는 점입니다.

${volume} 규모의 비즈니스에는 예약, 결제, 고객 기록 및 자동 후속 응대를 포함한 실용적인 시스템을 구축할 수 있습니다.

저희 전문가가 곧 연락드려 필요 사항을 확인하고 적합한 다음 단계를 제안하겠습니다.

감사합니다,
SKH Global 팀`;
  }

  if (language === "ja") {
    return `こんにちは。
${businessName} の初期分析リクエストを受け取りました。

まず確認したところ、${channels} への依存と、現在の主な課題である「${painPoint}」が、フォローアップや成約までの流れを遅くしている可能性があります。

${volume} 規模のビジネスには、予約、決済、顧客管理、自動フォローアップをまとめた実用的なシステムをご提案できます。

専門スタッフがまもなくご連絡し、ご要望を確認したうえで最適な次のステップをご提案します。

よろしくお願いいたします。
SKH Global チーム`;
  }

  if (language === "hi") {
    return `नमस्ते,
हमें ${businessName} के लिए आपका प्रारंभिक विश्लेषण अनुरोध मिल गया है।

हमारी पहली समझ यह है कि ${channels} पर निर्भरता और आपकी मुख्य समस्या (${painPoint}) follow-up और conversion को धीमा कर सकती है।

${volume} वाले व्यवसाय के लिए हम बुकिंग, भुगतान, ग्राहक रिकॉर्ड और स्वचालित फॉलो-अप का व्यावहारिक सिस्टम बना सकते हैं।

हमारे विशेषज्ञ जल्द आपसे संपर्क करेंगे ताकि आपकी जरूरत समझकर सही अगला कदम सुझाया जा सके।

सादर,
SKH Global टीम`;
  }

  if (language === "bn") {
    return `হ্যালো,
আমরা ${businessName}-এর জন্য আপনার প্রাথমিক বিশ্লেষণ অনুরোধ পেয়েছি।

আমাদের প্রাথমিক ধারণা হলো ${channels}-এর উপর নির্ভরতা এবং আপনার উল্লেখ করা মূল bottleneck (${painPoint}) follow-up ও conversion ধীর করে দিতে পারে।

${volume} পরিমাণ গ্রাহক সামলানো ব্যবসার জন্য আমরা বুকিং, পেমেন্ট, গ্রাহক রেকর্ড এবং স্বয়ংক্রিয় ফলো-আপের কার্যকর ব্যবস্থা তৈরি করতে পারি।

আমাদের বিশেষজ্ঞরা শীঘ্রই আপনার প্রয়োজন বুঝতে এবং উপযুক্ত পরবর্তী পদক্ষেপ জানাতে যোগাযোগ করবেন।

শুভেচ্ছান্তে,
SKH Global টিম`;
  }

  if (language === "ur") {
    return `السلام علیکم،
ہمیں ${businessName} کے لیے آپ کی ابتدائی analysis request موصول ہو گئی ہے۔

ہماری ابتدائی رائے یہ ہے کہ ${channels} پر انحصار اور آپ کا بیان کردہ بنیادی مسئلہ (${painPoint}) follow-up اور conversion کو سست کر سکتا ہے۔

${volume} والے کاروبار کے لیے ہم بکنگ، ادائیگی، کسٹمر ریکارڈ اور خودکار فالو اپ کا عملی نظام بنا سکتے ہیں۔

ہمارے ماہرین جلد آپ سے رابطہ کریں گے تاکہ آپ کی ضرورت سمجھ کر مناسب اگلا قدم تجویز کیا جا سکے۔

خیر اندیش،
SKH Global ٹیم`;
  }

  if (language === "sw") {
    return `Habari,
tumepokea ombi la uchambuzi wa awali kwa ${businessName}.

Mtazamo wetu wa kwanza ni kwamba kutegemea ${channels}, pamoja na changamoto kuu uliyoeleza (${painPoint}), kunaweza kuchelewesha follow-up na conversion.

Kwa biashara yenye ${volume}, tunaweza kujenga mfumo rahisi wa miadi, malipo, taarifa za wateja na ufuatiliaji wa kiotomatiki.

Wataalamu wetu watawasiliana nawe hivi karibuni kuelewa mahitaji yako na kupendekeza hatua inayofaa.

Kwa heshima,
Timu ya SKH Global`;
  }

  return `Hello,
We have received your request for ${businessName}.

Based on your current channels (${channels}) and the issue you described (${painPoint}), some customer follow-up may still be taking too much manual time.

For a business handling ${volume}, we can design the right combination of online booking, secure payments, customer tracking and automated follow-up, or build a complete custom platform when needed.

Our specialists will contact you soon to understand your needs and recommend the right next step.

Best,
SKH Global Team`;
};

const generateAutoReply = async (clientData: Record<string, string>) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.warn("[AI] GEMINI_API_KEY missing. Using fallback auto-reply.");
    return sanitizeCustomerEmail(buildFallbackAutoReply(clientData));
  }

  try {
    const promptInstructions = await readAiEmailPrompt();
    const clientDataText = Object.entries(clientData)
      .map(([key, value]) => `- ${key}: ${value || "N/A"}`)
      .join("\n");

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`
${promptInstructions}

Use the instructions above to write the customer auto-reply email.
Keep it premium, specific, concise, and ready to send. Do not include markdown headings.
Do not mention AI, artificial intelligence, test messages, test submissions, architecture jargon, blueprints, or a 10-minute call.
Use simple customer-friendly language. Describe practical options such as booking, payments, customer follow-up, chatbots, automation, or custom software only when relevant.
For the next step, say that our specialists will contact them soon.

CLIENT DATA:
${clientDataText}
`);

    return sanitizeCustomerEmail(result.response.text());
  } catch (error) {
    console.error("[AI] Auto-reply generation failed. Using fallback auto-reply.", error);
    return sanitizeCustomerEmail(buildFallbackAutoReply(clientData));
  }
};

const sendWebResponse = async (webResponse: Response, res: express.Response) => {
  const body = await webResponse.text();
  res.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") {
      res.setHeader(key, value);
    }
  });
  res.send(body);
};

const createEmailTransporter = () => ({
  emailUser: getSmtpUser(),
  transporter: createSmtpTransporter(),
});

const renderCustomerEmail = ({
  title,
  preheader,
  body,
  ticketNumber,
  offersUrl,
  language,
  direction = "rtl",
}: {
  title: string;
  preheader: string;
  body: string;
  ticketNumber?: string;
  offersUrl: string;
  language?: string;
  direction?: "rtl" | "ltr";
}) => {
  const align = direction === "rtl" ? "right" : "left";
  const copy = getEmailCopy(language);

  return `
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0;background:#020617;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#0f172a;border:1px solid #1e293b;border-radius:28px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#ffffff;box-shadow:0 24px 80px rgba(2,6,23,.55);">
            <tr>
              <td style="background:#020617;padding:0;">
                <img src="cid:${logoAttachment.cid}" alt="SKH Global" width="680" style="display:block;width:100%;max-width:680px;height:auto;border:0;">
              </td>
            </tr>
            <tr>
              <td style="padding:34px 28px 12px;text-align:center;">
                <div style="display:inline-block;padding:8px 13px;border:1px solid rgba(14,165,233,.35);border-radius:999px;background:rgba(14,165,233,.08);color:#38bdf8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  SKH.GLOBAL
                </div>
                <h1 style="margin:18px 0 0;color:#ffffff;font-size:26px;line-height:1.25;font-weight:900;letter-spacing:.2px;">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td dir="${direction}" style="padding:18px 34px 10px;text-align:${align};">
                <div style="white-space:pre-line;color:#cbd5e1;font-size:16px;line-height:1.95;">${escapeHtml(body)}</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 34px 12px;">
                <a href="${escapeHtml(offersUrl)}" target="_blank" rel="noopener" style="display:inline-block;background:linear-gradient(135deg,#7C3AED 0%,#2563EB 55%,#38D8FF 100%);color:#ffffff;text-decoration:none;border-radius:14px;padding:16px 26px;font-size:13px;font-weight:900;letter-spacing:1px;text-transform:uppercase;box-shadow:0 14px 38px rgba(37,99,235,.32);">
                  ${escapeHtml(copy.button)}
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 34px 34px;">
                <p style="margin:0;color:#64748b;font-size:12px;letter-spacing:.6px;">${escapeHtml(copy.ticket)}: ${escapeHtml(ticketNumber || "N/A")}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

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
      email_config: !!process.env.SMTP_USER && !!process.env.SMTP_PASS,
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
    try {
      const request = new Request(`${getSiteUrl(req)}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      await sendWebResponse(await handleAuditPost(request), res);
    } catch (error) {
      console.error("[API-AUDIT] ERROR:", error);
      res.status(500).json({
        error: "Submission Failed",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const request = new Request(`${getSiteUrl(req)}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      await sendWebResponse(await handleContactPost(request), res);
    } catch (error) {
      console.error("[API-CONTACT] ERROR:", error);
      res.status(500).json({ error: "Contact submission failed" });
    }
  });

  app.get("/api/availability", async (_req, res) => {
    try {
      await sendWebResponse(await handleAvailabilityGet(), res);
    } catch (error) {
      console.error("[API-AVAILABILITY] ERROR:", error);
      res.status(500).json({ error: "Failed to load availability" });
    }
  });

  app.post("/api/book-slot", async (req, res) => {
    try {
      const request = new Request(`${getSiteUrl(req)}/api/book-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      await sendWebResponse(await handleBookSlotPost(request), res);
    } catch (error) {
      console.error("[API-BOOK-SLOT] ERROR:", error);
      res.status(500).json({ error: "Booking failed" });
    }
  });

  app.all("/api/admin/*splat", async (req, res) => {
    try {
      const request = new Request(`${getSiteUrl(req)}${req.originalUrl}`, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization ? { Authorization: String(req.headers.authorization) } : {}),
        },
        body: ["POST", "PATCH", "PUT"].includes(req.method) ? JSON.stringify(req.body) : undefined,
      });
      await sendWebResponse(await handleAdminRequest(request), res);
    } catch (error) {
      console.error("[API-ADMIN] ERROR:", error);
      res.status(500).json({ error: "Admin request failed" });
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

export {
  cleanDisplayName,
  normalizeLanguage,
  isRtlLanguage,
  languageNames,
  getEmailCopy,
  generateAutoReply,
  createEmailTransporter,
  renderCustomerEmail,
  logoAttachment
};

if (process.argv.some((argument) => /server\.ts$/.test(argument)) && !process.env.NETLIFY) {
  startServer();
}
