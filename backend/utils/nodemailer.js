const nodemailer = require("nodemailer");

const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 2525,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 60000,
      greetingTimeout: 60000,
      socketTimeout: 60000,
    });

    const info = await transporter.sendMail({
      from: `"Shop" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Email Error:", {
      message: error.message,
      code: error.code,
      response: error.response,
    });

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmailForOtp;
