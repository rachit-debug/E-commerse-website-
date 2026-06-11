const nodemailer = require("nodemailer");

const SMTP_HOSTNAME = "smtp.gmail.com";

async function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error(
      "Email is not configured: set GMAIL_USER and GMAIL_PASS (use a Gmail App Password).",
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOSTNAME,
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 25000,
    tls: {
      servername: SMTP_HOSTNAME,
      rejectUnauthorized: true,
    },
    auth: {
      user: process.env.GMAIL_USER.trim(),
      pass: process.env.GMAIL_PASS.trim(),
    },
  });
}

/**
 * Sends OTP email. Returns true on success, false on failure (logs error).
 * @param {string} email
 * @param {string} otp
 * @returns {Promise<boolean>}
 */
const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    const fromUser = (process.env.GMAIL_USER || "").trim();

    const mailOptions = {
      from: `"Shop" <${fromUser}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[sendEmailForOtp]", message);
    return false;
  }
};

module.exports = sendEmailForOtp;
