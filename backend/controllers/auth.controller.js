const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp, generateOtpExpiry } = require("../utils/common");
const { userRegistrationSchema } = require("../utils/validators");
const sendEmailForOtp = require("../utils/nodemailer");

const SALTS = 10;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { error } = userRegistrationSchema.validate({
      name,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();

    const hashedPassword = await bcrypt.hash(password, SALTS);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newUser.save();

    const mailResult = await sendEmailForOtp(email, otp);
    if (!mailResult.success) {
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        message: `Failed to send OTP email. ${mailResult.error}. In production, set SENDGRID_API_KEY in Render.`,
      });
    }

    res
      .status(201)
      .json({ message: "User registered successfully. OTP sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    res.status(200).json({ message: "Email verified successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const mailResult = await sendEmailForOtp(email, otp);
    if (!mailResult.success) {
      return res.status(500).json({
        message: `Failed to send OTP email. ${mailResult.error}. Check server mail configuration.`,
      });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("[resendOtp]", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.isVerified) {
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        isVerified: user.isVerified,
      });
    }

    return res.status(200).json({
      message: "Login successful, but email not verified",
      token: null,
      isVerified: user.isVerified,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
