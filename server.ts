import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

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
  ar: { button: "عرض المسار المقترح", ticket: "رقم التذكرة", received: "تم استلام طلبكم في SKH Global.", subject: "تحليلكم جاهز", titlePrefix: "التقرير الأولي لهندسة الإيرادات لـ", genericBusiness: "عملكم" },
  bn: { button: "প্রস্তাবিত পথ দেখুন", ticket: "টিকিট নম্বর", received: "SKH Global-এ আপনার অনুরোধ গ্রহণ করা হয়েছে।", subject: "আপনার বিশ্লেষণ প্রস্তুত", titlePrefix: "Revenue Architecture প্রাথমিক রিপোর্ট:", genericBusiness: "আপনার ব্যবসা" },
  de: { button: "Vorgeschlagenen Plan ansehen", ticket: "Ticketnummer", received: "Ihre Anfrage bei SKH Global wurde empfangen.", subject: "Ihre Analyse ist bereit", titlePrefix: "Erster Revenue-Architecture-Bericht fuer", genericBusiness: "Ihr Unternehmen" },
  en: { button: "View Proposed Path", ticket: "Ticket ID", received: "Your request has been received by SKH Global.", subject: "Your analysis is ready", titlePrefix: "Initial Revenue Architecture Report for", genericBusiness: "your business" },
  es: { button: "Ver ruta propuesta", ticket: "Numero de ticket", received: "Hemos recibido su solicitud en SKH Global.", subject: "Su analisis esta listo", titlePrefix: "Informe inicial de Revenue Architecture para", genericBusiness: "su negocio" },
  fa: { button: "مشاهده مسیر پیشنهادی", ticket: "شماره تیکت", received: "درخواست شما در SKH Global ثبت شد.", subject: "آنالیز شما آماده است", titlePrefix: "گزارش اولیه Revenue Architecture برای", genericBusiness: "بیزینس شما" },
  fr: { button: "Voir le parcours propose", ticket: "Numero de ticket", received: "Votre demande a bien ete recue par SKH Global.", subject: "Votre analyse est prete", titlePrefix: "Rapport initial Revenue Architecture pour", genericBusiness: "votre entreprise" },
  hi: { button: "प्रस्तावित मार्ग देखें", ticket: "टिकट नंबर", received: "SKH Global को आपका अनुरोध मिल गया है।", subject: "आपका विश्लेषण तैयार है", titlePrefix: "Revenue Architecture की प्रारंभिक रिपोर्ट:", genericBusiness: "आपका व्यवसाय" },
  it: { button: "Vedi percorso proposto", ticket: "Numero ticket", received: "La tua richiesta e stata ricevuta da SKH Global.", subject: "La tua analisi e pronta", titlePrefix: "Report iniziale Revenue Architecture per", genericBusiness: "la tua azienda" },
  ja: { button: "提案された流れを見る", ticket: "チケット番号", received: "SKH Global がリクエストを受け付けました。", subject: "分析が準備できました", titlePrefix: "Revenue Architecture 初期レポート：", genericBusiness: "あなたのビジネス" },
  ko: { button: "제안 경로 보기", ticket: "티켓 번호", received: "SKH Global에서 요청을 접수했습니다.", subject: "분석이 준비되었습니다", titlePrefix: "Revenue Architecture 초기 리포트:", genericBusiness: "귀하의 비즈니스" },
  pt: { button: "Ver caminho proposto", ticket: "Numero do ticket", received: "Recebemos a sua solicitacao na SKH Global.", subject: "A sua analise esta pronta", titlePrefix: "Relatorio inicial de Revenue Architecture para", genericBusiness: "o seu negocio" },
  ru: { button: "Посмотреть предложенный путь", ticket: "Номер заявки", received: "Ваш запрос получен SKH Global.", subject: "Ваш анализ готов", titlePrefix: "Первичный отчет Revenue Architecture для", genericBusiness: "вашего бизнеса" },
  sw: { button: "Angalia njia iliyopendekezwa", ticket: "Namba ya tiketi", received: "Ombi lako limepokelewa na SKH Global.", subject: "Uchambuzi wako uko tayari", titlePrefix: "Ripoti ya awali ya Revenue Architecture kwa", genericBusiness: "biashara yako" },
  tr: { button: "Onerilen yolu gor", ticket: "Talep numarasi", received: "Talebiniz SKH Global tarafindan alindi.", subject: "Analiziniz hazir", titlePrefix: "Revenue Architecture ilk raporu:", genericBusiness: "isletmeniz" },
  ur: { button: "مجوزہ راستہ دیکھیں", ticket: "ٹکٹ نمبر", received: "آپ کی درخواست SKH Global کو موصول ہو گئی ہے۔", subject: "آپ کا تجزیہ تیار ہے", titlePrefix: "Revenue Architecture کی ابتدائی رپورٹ برائے", genericBusiness: "آپ کا بزنس" },
  zh: { button: "查看建议路径", ticket: "工单编号", received: "SKH Global 已收到您的请求。", subject: "您的分析已准备好", titlePrefix: "Revenue Architecture 初步报告：", genericBusiness: "您的业务" }
};

const getEmailCopy = (language?: string) => emailUiCopy[normalizeLanguage(language)] || emailUiCopy.en;

const buildFallbackAutoReply = (clientData: Record<string, string>) => {
  const language = normalizeLanguage(clientData["Language"]);
  const copy = getEmailCopy(language);
  const businessName = cleanDisplayName(clientData["Business Name"]) || copy.genericBusiness;
  const channels = clientData["Main Channels"] || "کانال‌های فعلی";
  const painPoint = clientData["Biggest Pain Point"] || "فرآیندهای دستی";
  const volume = clientData["Monthly Volume"] || "حجم فعلی درخواست‌ها";

  if (language === "fa") {
    return `سلام،
درخواست آنالیز اولیه برای ${businessName} دریافت شد و اطلاعات شما بررسی اولیه شد.

برداشت ما این است که تکیه روی ${channels} در کنار چالش اصلی شما یعنی ${painPoint}، بخشی از ظرفیت فروش و پیگیری را در مسیرهای دستی نگه داشته است.

برای بیزینسی با ${volume}، پیشنهاد ما ساخت یک Revenue Architecture اختصاصی است: سیستمی برای زمان‌بندی، دریافت بیعانه، ثبت لیدها در CRM و پیگیری خودکار، بدون اینکه کیفیت ارتباط با مشتری افت کند.

کارشناسان ما به‌زودی با شما تماس خواهند گرفت تا Blueprint اولیه را مرور کنند و مشخص شود کدام بخش اتوماسیون بیشترین اثر را روی رشد شما دارد.

با احترام،
SKH Global Architecture Unit`;
  }

  if (language === "fr") {
    return `Bonjour,
Nous avons bien recu la demande d'analyse initiale pour ${businessName}.

Notre premiere lecture indique que votre dependance a ${channels}, combinee a votre enjeu principal (${painPoint}), peut ralentir le suivi commercial et la conversion.

Pour une activite avec ${volume}, l'opportunite principale consiste a structurer une Revenue Architecture: planification automatisee, collecte d'acomptes, CRM et relances systematiques, sans perdre la qualite de la relation client.

Nos specialistes vous contacteront prochainement afin de revoir le Blueprint initial et d'identifier le point d'automatisation le plus utile pour votre croissance.

Cordialement,
SKH Global Architecture Unit`;
  }

  if (language === "ar") {
    return `مرحباً،
تم استلام طلب التحليل الاولي الخاص بـ ${businessName}.

تشير مراجعتنا الاولية إلى أن الاعتماد على ${channels} مع التحدي الحالي (${painPoint}) قد يبطئ المتابعة والتحويل.

بالنسبة لعمل بهذا الحجم (${volume})، تكمن الفرصة في بناء Revenue Architecture: جدولة آلية، تحصيل عربون، CRM، ومتابعات منظمة دون التأثير على جودة التواصل مع العملاء.

سيتواصل معكم خبراؤنا قريباً لمراجعة الـ Blueprint الاولي وتحديد نقطة الأتمتة الأعلى تأثيراً على النمو.

مع التحية،
SKH Global Architecture Unit`;
  }

  if (language === "es") {
    return `Hola,
Hemos recibido la solicitud de analisis inicial para ${businessName}.

Nuestra primera lectura indica que depender de ${channels}, junto con el principal bloqueo que describio (${painPoint}), puede estar ralentizando el seguimiento y la conversion.

Para un negocio con ${volume}, la primera oportunidad suele ser construir una Revenue Architecture mas solida: reservas automatizadas, cobro de depositos, CRM y seguimiento estructurado sin perder calidad en la comunicacion con el cliente.

Nuestros especialistas se pondran en contacto pronto para revisar el Blueprint inicial e identificar el punto de automatizacion con mayor impacto en su crecimiento.

Saludos,
SKH Global Architecture Unit`;
  }

  if (language === "de") {
    return `Hallo,
wir haben die erste Analyseanfrage fuer ${businessName} erhalten.

Unsere erste Einschaetzung ist, dass die Abhaengigkeit von ${channels} zusammen mit dem beschriebenen Engpass (${painPoint}) Follow-up und Conversion verlangsamen kann.

Fuer ein Unternehmen mit ${volume} liegt die groesste Chance meist in einer staerkeren Revenue Architecture: automatisierte Terminbuchung, Anzahlungen, CRM-Erfassung und strukturierte Nachverfolgung, ohne die Qualitaet der Kundenkommunikation zu senken.

Unsere Spezialisten werden Sie in Kuerze kontaktieren, um den ersten Blueprint zu pruefen und den wirkungsvollsten Automationspunkt fuer Ihr Wachstum zu identifizieren.

Beste Gruesse,
SKH Global Architecture Unit`;
  }

  if (language === "pt") {
    return `Ola,
recebemos o pedido de analise inicial para ${businessName}.

A nossa primeira leitura e que depender de ${channels}, juntamente com o principal bloqueio descrito (${painPoint}), pode estar a atrasar o acompanhamento e a conversao.

Para um negocio com ${volume}, a primeira oportunidade costuma ser uma Revenue Architecture mais forte: agendamento automatico, recolha de depositos, CRM e follow-up estruturado sem perder qualidade na comunicacao com o cliente.

Os nossos especialistas entrarao em contacto em breve para rever o Blueprint inicial e identificar o ponto de automacao com maior impacto no crescimento.

Cumprimentos,
SKH Global Architecture Unit`;
  }

  if (language === "it") {
    return `Ciao,
abbiamo ricevuto la richiesta di analisi iniziale per ${businessName}.

La nostra prima lettura e che dipendere da ${channels}, insieme al principale blocco indicato (${painPoint}), possa rallentare follow-up e conversione.

Per un'attivita con ${volume}, la prima opportunita e costruire una Revenue Architecture piu solida: prenotazioni automatiche, raccolta depositi, CRM e follow-up strutturato senza perdere qualita nella comunicazione con il cliente.

I nostri specialisti ti contatteranno presto per rivedere il Blueprint iniziale e individuare il punto di automazione con maggiore impatto sulla crescita.

Cordiali saluti,
SKH Global Architecture Unit`;
  }

  if (language === "tr") {
    return `Merhaba,
${businessName} icin ilk analiz talebini aldik.

Ilk degerlendirmemiz, ${channels} kanallarina bagimli kalmanin ve belirttiginiz ana sorunun (${painPoint}) takip ve donusum surecini yavaslatabilecegi yonunde.

${volume} hacmindeki bir isletme icin ilk firsat genellikle daha guclu bir Revenue Architecture kurmaktir: otomatik randevu, depozito toplama, CRM kaydi ve yapilandirilmis takip.

Uzmanlarimiz ilk Blueprint'i incelemek ve buyumeniz icin en etkili otomasyon noktasini belirlemek uzere yakinda sizinle iletisime gececek.

Saygilarimizla,
SKH Global Architecture Unit`;
  }

  if (language === "ru") {
    return `Здравствуйте,
мы получили первичный запрос на анализ для ${businessName}.

Первичная оценка показывает, что зависимость от ${channels} вместе с указанным узким местом (${painPoint}) может замедлять follow-up и конверсию.

Для бизнеса с объемом ${volume} первая возможность обычно заключается в более сильной Revenue Architecture: автоматическая запись, сбор депозитов, CRM и структурированное сопровождение клиентов.

Наши специалисты скоро свяжутся с вами, чтобы разобрать первичный Blueprint и определить самую эффективную точку автоматизации для роста.

С уважением,
SKH Global Architecture Unit`;
  }

  if (language === "zh") {
    return `您好，
我们已收到 ${businessName} 的初步分析请求。

我们的初步判断是，依赖 ${channels}，再加上您描述的主要瓶颈（${painPoint}），可能正在减慢跟进和转化。

对于客户规模为 ${volume} 的业务，第一步通常是建立更强的 Revenue Architecture：自动预约、定金收取、CRM 记录和结构化跟进，同时保持客户沟通质量。

我们的专家会尽快与您联系，审阅初步 Blueprint，并确定对增长影响最大的自动化节点。

此致，
SKH Global Architecture Unit`;
  }

  if (language === "ko") {
    return `안녕하세요,
${businessName}에 대한 초기 분석 요청을 받았습니다.

저희의 첫 판단은 ${channels}에 대한 의존과 말씀하신 주요 병목(${painPoint})이 후속 응대와 전환 속도를 늦출 수 있다는 점입니다.

${volume} 규모의 비즈니스에서는 보통 더 강한 Revenue Architecture가 첫 기회입니다. 자동 예약, 보증금 수집, CRM 기록, 구조화된 follow-up을 통해 고객 커뮤니케이션 품질을 유지하면서 운영을 정리할 수 있습니다.

저희 전문가가 곧 연락드려 초기 Blueprint를 검토하고 성장에 가장 큰 영향을 줄 자동화 지점을 확인하겠습니다.

감사합니다,
SKH Global Architecture Unit`;
  }

  if (language === "ja") {
    return `こんにちは。
${businessName} の初期分析リクエストを受け取りました。

まず確認したところ、${channels} への依存と、現在の主な課題である「${painPoint}」が、フォローアップや成約までの流れを遅くしている可能性があります。

${volume} 規模のビジネスでは、最初の改善ポイントはより強い Revenue Architecture を作ることです。予約の自動化、デポジット回収、CRM記録、体系的なフォローアップにより、顧客対応の質を保ちながら運用を整理できます。

専門スタッフがまもなくご連絡し、初期 Blueprint を確認したうえで、成長に最も効果のある自動化ポイントを特定します。

よろしくお願いいたします。
SKH Global Architecture Unit`;
  }

  if (language === "hi") {
    return `नमस्ते,
हमें ${businessName} के लिए आपका प्रारंभिक विश्लेषण अनुरोध मिल गया है।

हमारी पहली समझ यह है कि ${channels} पर निर्भरता और आपकी मुख्य समस्या (${painPoint}) follow-up और conversion को धीमा कर सकती है।

${volume} वाले बिजनेस के लिए पहला अवसर आम तौर पर मजबूत Revenue Architecture बनाना होता है: automated scheduling, deposit collection, CRM capture और structured follow-up.

हमारे विशेषज्ञ जल्द ही आपसे संपर्क करेंगे ताकि initial Blueprint की समीक्षा हो सके और growth के लिए सबसे प्रभावी automation point पहचाना जा सके।

सादर,
SKH Global Architecture Unit`;
  }

  if (language === "bn") {
    return `হ্যালো,
আমরা ${businessName}-এর জন্য আপনার প্রাথমিক বিশ্লেষণ অনুরোধ পেয়েছি।

আমাদের প্রাথমিক ধারণা হলো ${channels}-এর উপর নির্ভরতা এবং আপনার উল্লেখ করা মূল bottleneck (${painPoint}) follow-up ও conversion ধীর করে দিতে পারে।

${volume} পরিমাণ গ্রাহক সামলানো ব্যবসার জন্য প্রথম সুযোগ হলো একটি শক্তিশালী Revenue Architecture তৈরি করা: automated scheduling, deposit collection, CRM capture এবং structured follow-up.

আমাদের বিশেষজ্ঞরা শীঘ্রই আপনার সাথে যোগাযোগ করবেন initial Blueprint পর্যালোচনা করতে এবং growth-এর জন্য সবচেয়ে কার্যকর automation point নির্ধারণ করতে।

শুভেচ্ছান্তে,
SKH Global Architecture Unit`;
  }

  if (language === "ur") {
    return `السلام علیکم،
ہمیں ${businessName} کے لیے آپ کی ابتدائی analysis request موصول ہو گئی ہے۔

ہماری ابتدائی رائے یہ ہے کہ ${channels} پر انحصار اور آپ کا بیان کردہ بنیادی مسئلہ (${painPoint}) follow-up اور conversion کو سست کر سکتا ہے۔

${volume} والے بزنس کے لیے پہلا موقع ایک مضبوط Revenue Architecture بنانا ہے: automated scheduling، deposit collection، CRM capture اور structured follow-up.

ہمارے ماہرین جلد آپ سے رابطہ کریں گے تاکہ initial Blueprint کا جائزہ لیا جائے اور growth کے لیے سب سے مؤثر automation point کی شناخت ہو۔

خیر اندیش،
SKH Global Architecture Unit`;
  }

  if (language === "sw") {
    return `Habari,
tumepokea ombi la uchambuzi wa awali kwa ${businessName}.

Mtazamo wetu wa kwanza ni kwamba kutegemea ${channels}, pamoja na changamoto kuu uliyoeleza (${painPoint}), kunaweza kuchelewesha follow-up na conversion.

Kwa biashara yenye ${volume}, fursa ya kwanza mara nyingi ni kujenga Revenue Architecture imara: automated scheduling, deposit collection, CRM capture na structured follow-up.

Wataalamu wetu watawasiliana nawe hivi karibuni ili kupitia Blueprint ya awali na kubaini sehemu ya automation yenye athari kubwa zaidi kwenye ukuaji.

Kwa heshima,
SKH Global Architecture Unit`;
  }

  return `Hello,
We have received the initial audit request for ${businessName}.

Our first read is that relying on ${channels}, alongside the main bottleneck you described (${painPoint}), may be slowing down follow-up and conversion.

For a business handling ${volume}, the first opportunity is usually a stronger Revenue Architecture: automated scheduling, deposit collection, CRM capture, and structured follow-up without reducing the quality of customer communication.

Our specialists will contact you soon to review the initial Blueprint and identify the highest-impact automation point for your growth.

Best,
SKH Global Architecture Unit`;
};

const generateAutoReply = async (clientData: Record<string, string>) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    console.warn("[AI] GEMINI_API_KEY missing. Using fallback auto-reply.");
    return buildFallbackAutoReply(clientData);
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
Do not mention AI, artificial intelligence, test messages, test submissions, or a 10-minute call.
For the next step, say that our specialists will contact them soon.

CLIENT DATA:
${clientDataText}
`);

    return result.response.text();
  } catch (error) {
    console.error("[AI] Auto-reply generation failed. Using fallback auto-reply.", error);
    return buildFallbackAutoReply(clientData);
  }
};

const createEmailTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    throw new Error("Server Configuration Error: Email credentials not set.");
  }

  return {
    emailUser,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass }
    })
  };
};

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
                <a href="${escapeHtml(offersUrl)}" target="_blank" rel="noopener" style="display:inline-block;background:#0ea5e9;color:#020617;text-decoration:none;border-radius:14px;padding:16px 26px;font-size:13px;font-weight:900;letter-spacing:1px;text-transform:uppercase;">
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
    
    const { businessName, email, phone, businessType, businessTypeLabel, volume, volumeLabel, ticketNumber, channels, channelsLabel, painPoint, painPointLabel, currentLanguage } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const displayBusinessName = cleanDisplayName(businessName);
      const language = normalizeLanguage(currentLanguage);
      const copy = getEmailCopy(language);

      console.log(`[API-AUDIT] Processing for ${displayBusinessName || "business"} (${email})`);

      console.log("[API-AUDIT] Generating AI response...");
      const aiResponse = await generateAutoReply({
        "Business Name": displayBusinessName,
        "Business Type": businessTypeLabel || businessType,
        "Main Channels": channelsLabel || channels,
        "Biggest Pain Point": painPointLabel || painPoint,
        "Monthly Volume": volumeLabel || volume,
        "Customer Email": email,
        "Customer Phone": phone,
        "Ticket Number": ticketNumber,
        "Language": languageNames[language] || languageNames.en
      });

      // 2. Transporter
      console.log("[API-AUDIT] Setting up email transporter...");
      const { emailUser, transporter } = createEmailTransporter();
      const htmlTemplate = renderCustomerEmail({
        title: `${copy.titlePrefix} ${displayBusinessName || copy.genericBusiness}`,
        preheader: copy.received,
        body: aiResponse,
        ticketNumber,
        offersUrl: getOffersUrl(req),
        language,
        direction: isRtlLanguage(language) ? "rtl" : "ltr"
      });

      console.log(`[API-AUDIT] Sending mail to ${email}...`);
      await transporter.sendMail({
        from: `"SKH Architects" <${emailUser}>`,
        to: email,
        subject: `${copy.subject} - SKH Global`,
        html: htmlTemplate,
        attachments: [logoAttachment]
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
    const { fullName, email, company, investment, systemFocus, ticketNumber, currentLanguage } = req.body;
    
    try {
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const language = normalizeLanguage(currentLanguage);
      const copy = getEmailCopy(language);
      const displayCompany = cleanDisplayName(company);
      const { emailUser, transporter } = createEmailTransporter();

      const text = `
        New Contact Inquiry:
        Name: ${fullName}
        Email: ${email}
        Company: ${displayCompany || company}
        Investment: ${investment}
        Focus: ${systemFocus}
        Ticket: ${ticketNumber}
      `;

      await transporter.sendMail({
        from: `"SKH Inquiries" <${emailUser}>`,
        to: emailUser, // Send to self
        subject: `New Inquiry: ${displayCompany || "Website Inquiry"} (#${ticketNumber})`,
        text: text
      });

      console.log("[API-CONTACT] Inquiry email sent.");
      console.log(`[API-CONTACT] Generating auto-reply for ${email}...`);
      const aiResponse = await generateAutoReply({
        "Business Name": displayCompany,
        "Business Type": "Contact Inquiry",
        "Main Channels": "Website contact form",
        "Biggest Pain Point": systemFocus,
        "Monthly Volume": investment,
        "Customer Name": fullName,
        "Customer Email": email,
        "Ticket Number": ticketNumber,
        "Language": languageNames[language] || languageNames.en
      });

      await transporter.sendMail({
        from: `"SKH Architects" <${emailUser}>`,
        to: email,
        subject: `${copy.subject} - SKH Global`,
        html: renderCustomerEmail({
          title: copy.received,
          preheader: copy.received,
          body: aiResponse,
          ticketNumber,
          offersUrl: getOffersUrl(req),
          language,
          direction: isRtlLanguage(language) ? "rtl" : "ltr"
        }),
        attachments: [logoAttachment]
      });

      console.log("[API-CONTACT] Auto-reply sent to client.");
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
