import { Resend } from "resend";
import nodemailer from "nodemailer";

interface SendBookingEmailParams {
  to: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventVenue?: string;
}

// Read Resend API Key from environment or fallback SMTP PASS
const resendApiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
const resend = resendApiKey && resendApiKey.startsWith("re_") ? new Resend(resendApiKey) : null;

/**
 * Creates an SMTP Transporter fallback using Nodemailer if Resend SDK is not used.
 */
const createTransporter = () => {
  const user = process.env.NODE_MAILER_USER || process.env.SMTP_USER;
  const pass = process.env.NODE_MAILER_PASS || process.env.SMTP_PASS;
  const host = process.env.NODE_MAILER_HOST || process.env.SMTP_HOST || "smtp.resend.com";
  const port = Number(process.env.NODE_MAILER_PORT || process.env.SMTP_PORT || 465);

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

/**
 * Sends a confirmation email to the user when they book a spot for an event.
 * Priority: 1) Resend SDK, 2) SMTP Transporter, 3) Graceful simulation.
 */
export const sendBookingConfirmationEmail = async ({
  to,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
  eventVenue,
}: SendBookingEmailParams) => {
  try {
    const fromAddress = process.env.EMAIL_FROM || "DevEvents <onboarding@resend.dev>";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 20px; }
            .container { max-width: 580px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .brand { color: #10b981; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-decoration: none; }
            .title { color: #ffffff; font-size: 22px; font-weight: 700; margin-top: 16px; margin-bottom: 8px; }
            .subtitle { color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
            .card { background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .info-row { font-size: 14px; margin-bottom: 10px; color: #e4e4e7; display: flex; align-items: center; }
            .info-label { color: #10b981; font-weight: 600; min-width: 90px; }
            .footer { font-size: 12px; color: #71717a; text-align: center; border-top: 1px solid #27272a; padding-top: 16px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="brand">DevEvents</span>
            </div>

            <div class="title">Spot Secured! 🎉</div>
            <div class="subtitle">
              Your registration for <strong style="color: #10b981;">${eventTitle}</strong> has been confirmed. Below are your event details:
            </div>

            <div class="card">
              <div class="info-row">
                <span class="info-label">Event:</span>
                <span>${eventTitle}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span>${eventDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span>${eventTime}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span>${eventLocation}</span>
              </div>
              ${eventVenue ? `
              <div class="info-row">
                <span class="info-label">Venue:</span>
                <span>${eventVenue}</span>
              </div>` : ''}
            </div>

            <div class="subtitle">
              We look forward to having you! If you have any questions, feel free to reply to this email.
            </div>

            <div class="footer">
              © ${new Date().getFullYear()} DevEvents. The Hub for Every Dev Event You Can't Miss.
            </div>
          </div>
        </body>
      </html>
    `;

    // 1. Try Resend SDK
    if (resend) {
      const response = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject: `🎉 Spot Secured: ${eventTitle}`,
        html: htmlContent,
      });

      if (response.error) {
        console.error("[Email Service] Resend API returned error:", response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[Email Service] Live email sent via Resend to ${to}. Email ID:`, response.data?.id);
      return { success: true, emailId: response.data?.id };
    }

    // 2. Try Nodemailer Transporter
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: fromAddress,
        to,
        subject: `🎉 Spot Secured: ${eventTitle}`,
        html: htmlContent,
      });
      console.log(`[Email Service] Live email sent via SMTP transporter to ${to}`);
      return { success: true };
    }

    // 3. Fallback simulation log if credentials missing
    console.log(`\n[Email Service] Simulated email sent to ${to} for "${eventTitle}".\n`);
    return { success: true, simulated: true };
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Email error" };
  }
};
