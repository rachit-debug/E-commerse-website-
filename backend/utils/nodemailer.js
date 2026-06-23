const nodemailer = require("nodemailer");
const dns = require("dns");

if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const sendEmailForOtp = async (email, otp) => {
  try {
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_PASS?.replace(/\s/g, "");

    console.log("GMAIL_USER:", gmailUser);
    console.log("GMAIL_PASS_LENGTH:", gmailPass?.length);

    if (!gmailUser || !gmailPass) {
      throw new Error("GMAIL_USER or GMAIL_PASS missing");
    }

    dns.lookup("smtp.gmail.com", { family: 4 }, (err, address) => {
      if (err) {
        console.log("DNS Lookup Error:", err.message);
      } else {
        console.log("SMTP IPv4 Address:", address);
      }
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      family: 4,
      lookup: (hostname, options, callback) => {
        return dns.lookup(hostname, { family: 4 }, callback);
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();

    console.log("SMTP Connected Successfully");

    const mailOptions = {
      from: `"Shop" <${gmailUser}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h3>${otp}</h3>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email Sent Successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email Error:", {
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmailForOtp;
