const nodemailer = require("nodemailer");

const sendEmailForOtp = async (email, otp) => {
  try {
    const gmailUser = process.env.GMAIL_USER?.trim();
    const gmailPass = process.env.GMAIL_PASS?.replace(/\s/g, "");

    console.log("GMAIL_USER:", gmailUser);
    console.log("GMAIL_PASS_LENGTH:", gmailPass?.length);

    if (!gmailUser || !gmailPass) {
      throw new Error("GMAIL_USER or GMAIL_PASS missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
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

    console.log("Email Sent:", info.messageId);

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
