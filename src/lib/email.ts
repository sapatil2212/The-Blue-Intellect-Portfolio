import nodemailer from "nodemailer";

const EMAIL_HOST = process.env.EMAIL_HOST || "";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
const EMAIL_USERNAME = process.env.EMAIL_USERNAME || "";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "";
const EMAIL_BCC = process.env.EMAIL_BCC || "";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: any[];
}

export async function sendEmail({ to, subject, html, text, attachments }: SendEmailParams) {
  // If SMTP credentials are not configured, perform a mock terminal log fallback
  if (!EMAIL_HOST || !EMAIL_USERNAME || !EMAIL_PASSWORD) {
    console.log("\n=======================================================");
    console.log("             📧 [DEVELOPMENT OTP SIMULATOR] 📧");
    console.log(` TO:      ${to}`);
    console.log(` SUBJECT: ${subject}`);
    console.log(` CONTENT: ${text}`);
    console.log("=======================================================\n");
    return { success: true, mock: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"The Blue Intellect" <${EMAIL_USERNAME}>`,
      to,
      bcc: EMAIL_BCC || undefined,
      subject,
      text,
      html,
      attachments,
    });

    return { success: true, mock: false };
  } catch (error) {
    console.error("Nodemailer sendMail failed, logging as fallback instead:", error);
    console.log("\n=======================================================");
    console.log("   📧 [FALLBACK OTP SIMULATOR (SMTP CONNECTION FAILED)] 📧");
    console.log(` TO:      ${to}`);
    console.log(` SUBJECT: ${subject}`);
    console.log(` CONTENT: ${text}`);
    console.log("=======================================================\n");
    return { success: true, mock: true };
  }
}
