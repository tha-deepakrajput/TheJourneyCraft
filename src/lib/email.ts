import nodemailer from "nodemailer";

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification email with OTP code.
 * 
 * Uses SMTP configuration from environment variables.
 * Falls back to console logging in development if SMTP is not configured.
 */
export async function sendVerificationEmail(
  to: string,
  code: string,
  name: string
): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || "noreply@journeycraft.com";

  // If SMTP is not configured, log to console (dev mode)
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log("═══════════════════════════════════════════════");
    console.log(`📧 VERIFICATION CODE for ${to}: ${code}`);
    console.log("═══════════════════════════════════════════════");
    console.warn("[Email] SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort || "587"),
    secure: smtpPort === "465",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#0a0a0b;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#18181b;border-radius:24px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <!-- Header -->
        <div style="padding:40px 32px 24px;text-align:center;background:linear-gradient(135deg,rgba(249,115,22,0.1),rgba(168,85,247,0.05));">
          <div style="width:56px;height:56px;margin:0 auto 16px;background:rgba(249,115,22,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:28px;">🚀</span>
          </div>
          <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">
            Verify Your Email
          </h1>
          <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0;font-weight:400;">
            Welcome to JourneyCraft, ${name}!
          </p>
        </div>
        
        <!-- Code -->
        <div style="padding:32px;text-align:center;">
          <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 24px;line-height:1.6;">
            Enter this verification code in the app to complete your registration:
          </p>
          <div style="background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:16px;padding:20px;margin:0 auto;max-width:240px;">
            <span style="font-size:36px;font-weight:900;letter-spacing:8px;color:#f97316;font-family:monospace;">
              ${code}
            </span>
          </div>
          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:24px 0 0;line-height:1.5;">
            This code expires in <strong style="color:rgba(255,255,255,0.6);">10 minutes</strong>.<br/>
            If you didn't sign up for JourneyCraft, please ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="padding:16px 32px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;">
            © ${new Date().getFullYear()} JourneyCraft — A digital museum of life journeys.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"JourneyCraft" <${fromEmail}>`,
    to,
    subject: `${code} — Your JourneyCraft Verification Code`,
    html: htmlBody,
  });

  console.log(`[Email] Verification code sent to ${to}`);
}
