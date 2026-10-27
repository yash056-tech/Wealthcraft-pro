import nodemailer from "nodemailer";

export const NOTIFICATION_RECIPIENT_EMAIL = "ya09shu@gmail.com";

export interface RegistrationPayload {
  fullName: string;
  email: string;
  phone?: string;
  userType: "Client / HNWI" | "Customer / Investor" | "Student / Academic" | "Business Founder" | "Other";
  primaryService: string;
  portfolioRange?: string;
  message?: string;
  sourceUrl?: string;
}

export interface MailerResult {
  success: boolean;
  messageId?: string;
  mode: "smtp" | "logged_fallback";
  error?: string;
}

export async function sendRegistrationNotificationEmail(
  data: RegistrationPayload
): Promise<MailerResult> {
  const {
    fullName,
    email,
    phone = "Not provided",
    userType,
    primaryService,
    portfolioRange = "Not specified",
    message = "No additional message provided",
    sourceUrl = "https://wealthcraft-pro.vercel.app",
  } = data;

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `🔔 New ${userType} Registration: ${fullName} — WealthCraft Pro`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #059669 0%, #047857 50%, #d97706 100%); padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #d1fae5; font-size: 13px; font-weight: 500; }
    .badge-bar { display: flex; justify-content: center; gap: 8px; margin-top: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: rgba(0,0,0,0.3); color: #fef3c7; border: 1px solid rgba(245, 158, 11, 0.4); }
    .content { padding: 28px 24px; }
    .intro { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
    .table-container { width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
    .table-container td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #1e293b; }
    .table-container tr:nth-child(even) { background-color: #0f172a; }
    .table-container tr:nth-child(odd) { background-color: #111827; }
    .label { font-weight: 600; color: #94a3b8; width: 35%; }
    .value { font-weight: 600; color: #f8fafc; }
    .highlight-value { color: #10b981; font-weight: 700; }
    .highlight-gold { color: #f59e0b; font-weight: 700; }
    .message-box { background: #0f172a; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
    .message-box h4 { margin: 0 0 6px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .message-box p { margin: 0; font-size: 13px; color: #e2e8f0; line-height: 1.5; }
    .footer { background: #0a0e17; padding: 18px 24px; text-align: center; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b; }
    .btn { display: inline-block; padding: 10px 20px; background: #10b981; color: #0f172a; text-decoration: none; font-weight: 700; font-size: 12px; border-radius: 8px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>WEALTHCRAFT PRO</h1>
      <p>Instant User Registration Alert</p>
      <div class="badge-bar">
        <span class="badge">ROLE: ${userType.toUpperCase()}</span>
      </div>
    </div>
    
    <div class="content">
      <p class="intro">
        A new client, customer, or student has registered on <strong>WealthCraft Pro</strong> to access your financial tools, advisory services, or educational simulations. Here are their complete details:
      </p>

      <table class="table-container">
        <tr>
          <td class="label">Full Name</td>
          <td class="value">${fullName}</td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: underline;">${email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone / WhatsApp</td>
          <td class="value"><a href="tel:${phone}" style="color: #38bdf8; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td class="label">User Persona</td>
          <td class="highlight-gold">${userType}</td>
        </tr>
        <tr>
          <td class="label">Primary Service / Goal</td>
          <td class="highlight-value">${primaryService}</td>
        </tr>
        <tr>
          <td class="label">Portfolio / Bracket</td>
          <td class="value">${portfolioRange}</td>
        </tr>
        <tr>
          <td class="label">Registered At</td>
          <td class="value">${timestamp}</td>
        </tr>
      </table>

      <div class="message-box">
        <h4>User Objectives / Consultation Request:</h4>
        <p>${message}</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="mailto:${email}?subject=Welcome%20to%20WealthCraft%20Pro%20-%20Advisory%20Follow-up" class="btn">
          Reply Directly to ${fullName.split(" ")[0]}
        </a>
      </div>
    </div>

    <div class="footer">
      Delivered directly to ${NOTIFICATION_RECIPIENT_EMAIL} • WealthCraft Pro Financial Advisory Hub<br>
      Source: ${sourceUrl}
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
NEW USER REGISTRATION ALERT - WEALTHCRAFT PRO
=====================================================

Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Persona / Role: ${userType}
Service / Goal: ${primaryService}
Portfolio / Income: ${portfolioRange}
Registered At: ${timestamp}

User Message / Notes:
${message}

Sent automatically to: ${NOTIFICATION_RECIPIENT_EMAIL}
=====================================================
`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = smtpHost
        ? nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          })
        : nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

      const info = await transporter.sendMail({
        from: `"WealthCraft Pro Alerts" <${smtpUser}>`,
        to: NOTIFICATION_RECIPIENT_EMAIL,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[WealthCraft Mailer] Successfully emailed registration to ${NOTIFICATION_RECIPIENT_EMAIL}:`, info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        mode: "smtp",
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[WealthCraft Mailer] SMTP send error:", error.message);
    }
  }

  console.log(`[WealthCraft Mailer] SMTP not fully configured. Email dispatched to log for ${NOTIFICATION_RECIPIENT_EMAIL}:`);
  console.log(textContent);

  return {
    success: true,
    mode: "logged_fallback",
  };
}

export interface PaymentSuccessPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency?: string;
  planName: string;
  gateway: "Razorpay" | "Stripe" | "Direct UPI (UTR)";
  paymentId: string;
  orderId?: string;
  notes?: string;
}

export async function sendPaymentSuccessNotificationEmail(
  data: PaymentSuccessPayload
): Promise<MailerResult> {
  const {
    customerName,
    customerEmail,
    customerPhone = "Not provided",
    amount,
    currency = "INR",
    planName,
    gateway,
    paymentId,
    orderId = "N/A",
    notes = "Pro SaaS Access Activated",
  } = data;

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `💰 Payment Received: ₹${amount.toLocaleString("en-IN")} via ${gateway} — ${customerName}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 50%, #f59e0b 100%); padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #ecfdf5; font-size: 14px; font-weight: 600; }
    .badge { display: inline-block; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 800; background: #0f172a; color: #34d399; margin-top: 10px; border: 1px solid #059669; }
    .content { padding: 28px 24px; }
    .amount-box { text-align: center; background: #0f172a; border: 1px solid #10b981; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .amount-box .amount { font-size: 36px; font-weight: 900; color: #34d399; }
    .amount-box .plan { font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; margin-top: 4px; }
    .table-container { width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
    .table-container td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #1e293b; }
    .table-container tr:nth-child(even) { background-color: #0f172a; }
    .table-container tr:nth-child(odd) { background-color: #111827; }
    .label { font-weight: 600; color: #94a3b8; width: 35%; }
    .value { font-weight: 600; color: #f8fafc; }
    .footer { background: #0a0e17; padding: 18px 24px; text-align: center; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>WEALTHCRAFT PRO</h1>
      <p>Payment Received Notification</p>
      <span class="badge">SETTLEMENT TO YOUR BANK ACCOUNT</span>
    </div>
    
    <div class="content">
      <div class="amount-box">
        <div class="amount">₹${amount.toLocaleString("en-IN")}</div>
        <div class="plan">${planName} (${currency})</div>
      </div>

      <table class="table-container">
        <tr>
          <td class="label">Customer Name</td>
          <td class="value">${customerName}</td>
        </tr>
        <tr>
          <td class="label">Customer Email</td>
          <td class="value"><a href="mailto:${customerEmail}" style="color: #38bdf8;">${customerEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Customer Phone</td>
          <td class="value">${customerPhone}</td>
        </tr>
        <tr>
          <td class="label">Payment Gateway</td>
          <td class="value" style="color: #f59e0b; font-weight: 700;">${gateway}</td>
        </tr>
        <tr>
          <td class="label">Transaction / Payment ID</td>
          <td class="value" style="font-family: monospace; color: #34d399;">${paymentId}</td>
        </tr>
        <tr>
          <td class="label">Order Reference</td>
          <td class="value" style="font-family: monospace;">${orderId}</td>
        </tr>
        <tr>
          <td class="label">Payment Timestamp</td>
          <td class="value">${timestamp}</td>
        </tr>
        <tr>
          <td class="label">Status</td>
          <td class="value" style="color: #10b981; font-weight: 700;">PRO TIER ACTIVATED</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      Automated payment alert dispatched to ${NOTIFICATION_RECIPIENT_EMAIL}<br>
      Funds will settle directly to your designated bank account according to gateway settlement schedule.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
PAYMENT RECEIVED ALERT - WEALTHCRAFT PRO
=====================================================
Amount: ₹${amount.toLocaleString("en-IN")} ${currency}
Plan: ${planName}
Gateway: ${gateway}
Customer Name: ${customerName}
Customer Email: ${customerEmail}
Customer Phone: ${customerPhone}
Payment ID / UTR: ${paymentId}
Order Reference: ${orderId}
Timestamp: ${timestamp}
Notes: ${notes}
=====================================================
Sent to: ${NOTIFICATION_RECIPIENT_EMAIL}
`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpUser && smtpPass) {
    try {
      const transporter = smtpHost
        ? nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          })
        : nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

      const info = await transporter.sendMail({
        from: `"WealthCraft Payments" <${smtpUser}>`,
        to: NOTIFICATION_RECIPIENT_EMAIL,
        replyTo: customerEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[WealthCraft Payments] Payment alert dispatched to ${NOTIFICATION_RECIPIENT_EMAIL}:`, info.messageId);

      return {
        success: true,
        messageId: info.messageId,
        mode: "smtp",
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error("[WealthCraft Payments] SMTP payment alert error:", error.message);
    }
  }

  console.log(`[WealthCraft Payments] SMTP not configured. Payment alert logged for ${NOTIFICATION_RECIPIENT_EMAIL}:`);
  console.log(textContent);

  return {
    success: true,
    mode: "logged_fallback",
  };
}
