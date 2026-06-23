const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const SMTP_HOSTNAME = "smtp.gmail.com";

async function smtpIpv4Host() {
  try {
    const addrs = await dns.resolve4(SMTP_HOSTNAME);
    if (addrs && addrs.length) {
      return addrs[Math.floor(Math.random() * addrs.length)];
    }
  } catch (e) {
    console.warn(
      "[nodemailer] resolve4 failed, falling back to hostname:",
      e.message,
    );
  }
  return SMTP_HOSTNAME;
}

function normalizeEnvValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  const noQuotes = trimmed.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  return noQuotes;
}

function normalizeAppPassword(value) {
  if (typeof value !== "string") return value;
  return normalizeEnvValue(value).replace(/\s+/g, "");
}

async function createTransporter() {
  const gmailUser = normalizeEnvValue(process.env.GMAIL_USER);
  const gmailPass = normalizeAppPassword(process.env.GMAIL_PASS);

  const missing = [];
  if (!gmailUser) missing.push("GMAIL_USER");
  if (!gmailPass) missing.push("GMAIL_PASS");
  if (missing.length > 0) {
    throw new Error(
      `Email is not configured: missing ${missing.join(", ")}. Use a Gmail App Password from https://myaccount.google.com/apppasswords`,
    );
  }

  if (gmailPass.length !== 16) {
    throw new Error(
      `Email password invalid: GMAIL_PASS must be a 16-character Gmail App Password with no spaces. Received length ${gmailPass.length}.`,
    );
  }

  const host = await smtpIpv4Host();

  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    /** Required when `host` is a literal IP so STARTTLS cert matches smtp.gmail.com */
    servername: SMTP_HOSTNAME,
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 25000,
    tls: {
      servername: SMTP_HOSTNAME,
    },
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
}

/**
 * Sends OTP email. Returns true on success, false on failure (logs error).
 */
const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    const fromUser = process.env.GMAIL_USER;

    const mailOptions = {
      from: `"Shop" <${fromUser}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
      html: `<h2>Email Verification</h2><p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("[sendEmailForOtp] Email sent successfully to", email);
    return true;
  } catch (error) {
    console.error("[sendEmailForOtp] Error details:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });
    return false;
  }
};

module.exports = sendEmailForOtp;
