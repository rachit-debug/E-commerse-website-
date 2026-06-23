const nodemailer = require("nodemailer");

const sendEmailForOtp = async (email, otp) => {
  try {
    console.log("========== BREVO DEBUG ==========");
    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log(
      "SMTP_PASS_LENGTH:",
      process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 2525,
      secure: false,
      requireTLS: true,
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });

    console.log("Verifying SMTP connection...");

    await transporter.verify();

    console.log("✅ Brevo SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP is ${otp}`,
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Error");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Response:", error.response);
    console.error("Stack:", error.stack);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmailForOtp;
