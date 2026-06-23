const nodemailer = require("nodemailer");
const dns = require("dns");
const dnsPromises = dns.promises;

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

function normalizeEnvValue(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

function normalizeAppPassword(value) {
  if (typeof value !== "string") return value;
  return normalizeEnvValue(value).replace(/\s+/g, "");
}

async function resolveIpv4(hostname) {
  try {
    const addrs = await dnsPromises.resolve4(hostname);
    if (addrs && addrs.length) {
      return addrs[0];
    }
  } catch (error) {
    console.warn(
      "[nodemailer] resolve4 failed, using hostname:",
      error.message,
    );
  }
  return hostname;
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

  const smtpHost = await resolveIpv4("smtp.gmail.com");

  const configs = [
    {
      name: "gmail-ssl",
      host: smtpHost,
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
      connectionTimeout: 30000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      tls: { servername: "smtp.gmail.com", rejectUnauthorized: false },
    },
    {
      name: "gmail-starttls",
      host: smtpHost,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: gmailUser, pass: gmailPass },
      connectionTimeout: 30000,
      greetingTimeout: 20000,
      socketTimeout: 30000,
      tls: { servername: "smtp.gmail.com", rejectUnauthorized: false },
    },
  ];

  let lastError = null;

  for (const config of configs) {
    try {
      const transporter = nodemailer.createTransport(config);
      console.log(
        `[nodemailer] trying email transport ${config.name} ${config.host}:${config.port}`,
      );
      await transporter.verify();
      console.log(
        `[nodemailer] transport ${config.name} verified successfully`,
      );
      return transporter;
    } catch (error) {
      lastError = error;
      console.error(
        `[nodemailer] transport ${config.name} failed:`,
        error.message || error,
      );
    }
  }

  throw lastError;
}

/**
 * Sends OTP email. Returns true on success, false on failure (logs error).
 */
const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = await createTransporter();
    const fromUser = normalizeEnvValue(process.env.GMAIL_USER);

    const mailOptions = {
      from: `"Shop" <${fromUser}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
      html: `<h2>Email Verification</h2><p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
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
