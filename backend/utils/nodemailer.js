const nodemailer = require("nodemailer");

const sendEmailForOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    console.log("Brevo SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "OTP for Email Verification",
      text: `Your OTP for email verification is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

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
