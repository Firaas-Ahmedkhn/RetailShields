import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer"

let otpStore = {};

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const BIOMETRIC_API_URL = process.env.BIOMETRIC_API_URL


// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      biometricProfile,
      otpTransformation,
      agreementChecked,
    } = req.body;

    // 🧾 Input validation
    if (
      !name ||
      !email ||
      !password ||
      !biometricProfile ||
      !otpTransformation ||
      agreementChecked !== true
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields or agreement not checked" });
    }

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Password strength analysis
    const strengthScore = zxcvbn(password).score;
    let passwordStrength = "weak";
    if (strengthScore >= 4) passwordStrength = "strong";
    else if (strengthScore >= 2) passwordStrength = "medium";

    // 🔑 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      biometricProfile,
      otpTransformation,
      agreementChecked: true,
      passwordStrength,
      phishingTrainingCompleted: false,
      isLastBiometricValid: false,
    });

    await newUser.save();

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error("🔥 Registration Error:", err.message);
    res
      .status(500)
      .json({ message: "❌ Server error during registration" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, typingPattern, agreementChecked } = req.body;

    // 🔎 Validate input
    if (!email || !password || !typingPattern || typingPattern.length < 10) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // 🔐 Password strength check
    const strengthScore = zxcvbn(password).score;
    let passwordStrength = "weak";
    if (strengthScore >= 4) passwordStrength = "strong";
    else if (strengthScore >= 2) passwordStrength = "medium";

    // 🧠 Biometric comparison via FastAPI
    let score = -1;
    let prediction = "unknown";

    try {
      const response = await axios.post("http://localhost:8000/predict/biometric", {
        originalProfile: user.biometricProfile,
        attemptProfile: typingPattern,
      });

      score = response?.data?.score ?? -1;
      prediction = response?.data?.prediction ?? "rejected";
    } catch (err) {
      console.error("❌ Biometric API error:", err.message);
      return res.status(500).json({ message: "Biometric comparison failed. Try again." });
    }

    // ❌ Rejected login attempts
    if (prediction === "rejected") {
      return res.status(403).json({
        message: "❌ Biometric rejected. Access denied.",
        score,
      });
    }

    if (prediction === "suspicious") {
      return res.status(403).json({
        message: "⚠️ Suspicious biometric behavior. Please try again.",
        score,
      });
    }

    // ✅ Valid biometric match: Update biometric and compliance-related fields
    if (prediction === "valid") {
      await User.findByIdAndUpdate(user._id, {
        biometricProfile: typingPattern, // store latest correct pattern
        isLastBiometricValid: true,
        agreementChecked: agreementChecked === true, // ensure checkbox is tracked
        passwordStrength,
      });
    }

    // 🎯 Calculate Compliance Score (backend side)
    let compliance = 0;
    if (agreementChecked) compliance += 30;
    if (passwordStrength === "medium") compliance += 20;
    if (passwordStrength === "strong") compliance += 35;
    if (prediction === "valid") compliance += 30;
    if (user.phishingTrainingCompleted) compliance += 15;

    if (compliance > 100) compliance = 100;

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        riskScore: score,
        complianceScore: compliance,
        passwordStrength,
      },
    });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    res.status(500).json({ message: "Server error during biometric validation" });
  }
};

export const requestOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  otpStore[email] = {
    otp,
    timestamp: Date.now(),
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'retailshield864@gmail.com',
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'RetailShield <retailshield864@gmail.com>',
    to: email,
    subject: 'RetailShield OTP - Reset Your Password',
    text: `Hi,

You recently requested to reset your password on RetailShield.

Here’s your base OTP: ${otp}

🔒 Please note: This OTP is **not directly usable** as is.
You'll need to apply specific transformations based on the strategy you selected during registration (e.g., reversing the OTP, adding a prefix, or digit shifting).

If you did not initiate this request, please ignore this email.

– RetailShield Security Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ message: "Failed to send OTP" });
    return res.status(200).json({
      message: "OTP sent",
      otpTransformation: user.otpTransformation, // 🔁 Send it here
    });
  });
};


export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const entry = otpStore[email];

  if (!entry) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  const { otp: originalOtp } = entry;

  // 🔍 Fetch user and their transformation strategy from DB
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const transform = user.otpTransformation;

  // 🔄 Apply transformation
  let expectedOtp = originalOtp;

  switch (transform) {
    case 'reverse':
      expectedOtp = originalOtp.split('').reverse().join('');
      break;
    case 'prefix_42':
      expectedOtp = `42${originalOtp}`;
      break;
    case 'shift_+1':
      expectedOtp = [...originalOtp].map(d => (parseInt(d) + 1) % 10).join('');
      break;
    case 'shift_-1':
      expectedOtp = [...originalOtp].map(d => (parseInt(d) + 9) % 10).join('');
      break;
    default:
      break;
  }

  if (otp !== expectedOtp) {
    return res.status(400).json({ message: "Invalid OTP (Check your transformation rule)" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.updateOne({ email }, { $set: { password: hashed } });

  delete otpStore[email];

  return res.status(200).json({ message: "Password reset successfully" });
};
