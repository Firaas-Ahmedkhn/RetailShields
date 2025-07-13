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
    const { name, email, password, role, biometricProfile, otpTransformation } = req.body;

    if (!name || !email || !password || !role || !biometricProfile || !otpTransformation) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // 🔍 Capture IP address from headers (or fallback)
    let ip = req.body.registeredIp;
    if (!ip || ip.trim() === '') {
      ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role,
      biometricProfile,
      otpTransformation,
      registeredIP: ip,
    });

    console.log(ip);


    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, typingPattern } = req.body;

    const currentIP = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    if (user.registeredIp !== currentIP) {
      // Send email alert
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "retailshield864@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: "",
        to: email,
        subject: "🚨 Suspicious Login Attempt Detected",
        text: `Hello ${user.name},

A login attempt was made from an unrecognized IP address.

🔒 Attempted IP: ${currentIP}
✅ Registered IP: ${user.registeredIp}

The login attempt was blocked for your safety.

If this was you, please contact support to update your trusted IP address.

– RetailShield Security Team
`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error("Email alert failed:", err.message);
      });

      return res.status(403).json({ message: "Access denied: Unrecognized IP address" });
    }

    // 🔎 Validate input
    if (!email || !password || !typingPattern || typingPattern.length < 10) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    // 🧑‍💻 Check user existence
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔐 Password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // 🔍 Biometric comparison via FastAPI
    let score = -1;
    let prediction = "unknown";

    try {
      const response = await axios.post(`http://localhost:8000/predict/biometric`, {
        originalProfile: user.biometricProfile,
        attemptProfile: typingPattern,
      });
      console.log(response.data);


      score = response?.data?.score ?? -1;
      prediction = response?.data?.prediction ?? "rejected";
    } catch (biometricErr) {
      console.error("❌ Biometric API error:", biometricErr.message);
      return res.status(500).json({ message: "Biometric comparison failed. Try again." });
    }

    // 🛡️ Risk prediction handling
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

    // ✅ If biometric is valid, update stored biometric pattern
    if (prediction === "valid") {
      await User.findByIdAndUpdate(user._id, {
        biometricProfile: typingPattern,
      });
    }
    // console.log(score);


    // 🎟️ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ All good
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        riskScore: score,
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
