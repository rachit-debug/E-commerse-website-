const nodemailer = require("nodemailer");
const dns = require("dns");
const dnsPromises = dns.promises;
const https = require("https");

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

async function createGmailTransporter() {
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
    secure: true,
    port: 465,
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.verify();
  return transporter;
}

function sendViaSendGrid(email, subject, text, html) {
  const apiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY);
  const from =
    normalizeEnvValue(process.env.SENDGRID_FROM_EMAIL) ||
    normalizeEnvValue(process.env.GMAIL_USER);

  if (!apiKey) {
    throw new Error(
      "SendGrid API key is not configured. Set SENDGRID_API_KEY.",
    );
  }
  if (!from) {
    throw new Error(
      "SendGrid from address is not configured. Set SENDGRID_FROM_EMAIL or GMAIL_USER.",
    );
  }

  const body = JSON.stringify({
    personalizations: [{ to: [{ email }] }],
    from: { email: from },
    subject,
    content: [
      { type: "text/plain", value: text },
      { type: "text/html", value: html },
    ],
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.sendgrid.com",
        path: "/v3/mail/send",
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 30000,
      },
      (res) => {
        let responseData = "";
        res.on("data", (chunk) => {
          responseData += chunk;
        });
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(
              new Error(`SendGrid failed ${res.statusCode}: ${responseData}`),
            );
          }
        });
      },
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("SendGrid request timeout"));
    });
    req.write(body);
    req.end();
  });
}

/**
 * Sends OTP email. Returns { success, error } for better production logging.
 */
const sendEmailForOtp = async (email, otp) => {
  const subject = "OTP for Email Verification";
  const text = `Your OTP for email verification is: ${otp}`;
  const html = `<h2>Email Verification</h2><p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`;

  const sendGridApiKey = normalizeEnvValue(process.env.SENDGRID_API_KEY);

  try {
    if (sendGridApiKey) {
      console.log("[sendEmailForOtp] using SendGrid API");
      await sendViaSendGrid(email, subject, text, html);
      console.log(
        "[sendEmailForOtp] Email sent successfully via SendGrid to",
        email,
      );
      return { success: true };
    }

    console.log(
      "[sendEmailForOtp] SENDGRID_API_KEY not set, falling back to Gmail SMTP",
    );
    const transporter = await createGmailTransporter();
    const fromUser = normalizeEnvValue(process.env.GMAIL_USER);

    const mailOptions = {
      from: `"Shop" <${fromUser}>`,
      to: email,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      "[sendEmailForOtp] Email sent successfully via Gmail SMTP to",
      email,
    );
    return { success: true };
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    };
    console.error("[sendEmailForOtp] Error details:", errorDetails);
    return { success: false, error: error.message || "Unknown email error" };
  }
};

module.exports = sendEmailForOtp;
