import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer"
import zxcvbn from "zxcvbn";

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

    if (!name || !email || !password || !role || !biometricProfile || !otpTransformation) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check password strength using zxcvbn
    const strengthScore = zxcvbn(password).score;
    let passwordStrength = "weak";
    if (strengthScore >= 4) passwordStrength = "strong";
    else if (strengthScore >= 2) passwordStrength = "medium";

    // Initial compliance score based on password strength
    let complianceScore = 0;
    if (passwordStrength === "strong") complianceScore += 30;
    else if (passwordStrength === "medium") complianceScore += 15;
    // 🔍 Capture IP address from headers (or fallback)
    let ip = req.body.registeredIp;
    if (!ip || ip.trim() === '') {
      ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      biometricProfile,
      otpTransformation,
      registeredIp: ip,
      passwordStrength,
      complianceScore,
      agreementChecked: agreementChecked === true
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
    const { email, password, typingPattern, agreementChecked } = req.body;

    if (!email || !password || !typingPattern || typingPattern.length < 10) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(403).json({
        message: `Account locked due to multiple failed attempts. Try again after ${user.lockUntil.toLocaleString()}`,
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs
        user.loginAttempts = 0; // reset attempts after lock

        // Send email notification
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "retailshield864@gmail.com",
              pass: process.env.APP_PASSWORD,
            },
          });

          await transporter.sendMail({
            from: "Retail Shield <retailshield864@gmail.com>",
            to: email,
            subject: "🚨 Account Locked After Multiple Failed Attempts",
            text: `Hi ${user.name},\n\nYour account has been locked due to multiple incorrect password attempts.\n\n⏳ You can try again after: ${user.lockUntil.toLocaleString()}\n\nIf this wasn’t you, please contact support immediately.\n\n– Retail Shield Security`,
          });

        } catch (emailErr) {
          console.error("❌ Failed to send lock alert email:", emailErr.message);
        }

        await user.save();
        return res.status(403).json({ message: "Account locked for 24 hours due to multiple failed attempts" });
      }

      await user.save();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Password matched, reset attempts if needed
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    // 🔐 Password strength check
    const strengthScore = zxcvbn(password).score;
    let passwordStrength = "weak";
    if (strengthScore >= 4) passwordStrength = "strong";
    else if (strengthScore >= 2) passwordStrength = "medium";

    // 🧠 Biometric
    let score = -1;
    let prediction = "unknown";

   try {
  const response = await axios.post("http://localhost:8000/predict/biometric", {
    originalProfile: user.biometricProfile,
    attemptProfile: typingPattern,
  });

  score = response?.data?.score ?? -1;
  prediction = response?.data?.prediction ?? "rejected";

  console.log(`🧠 Biometric score for ${user.email}:`, score, '| Prediction:', prediction);
} catch (err) {
  return res.status(500).json({ message: "Biometric comparison failed. Try again." });
}

    if (prediction === "rejected") {
      console.log("Rejected:",score)
      return res.status(403).json({ message: "❌ Biometric rejected. Access denied.", score });
      
    }
    if (prediction === "suspicious") {
      // Send email to alert the user
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "retailshield864@gmail.com",
            pass: process.env.APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: "Retail Shield <retailshield864@gmail.com>",
          to: user.email,
          subject: "⚠️ Suspicious Login Behavior Detected",
          text: `Hi ${user.name},

We've detected suspicious biometric behavior during your recent login attempt.

🕵️‍♀️ It may indicate someone else trying to access your account.

You’ve been redirected to answer a security question to confirm it’s really you.

If this wasn’t you, please change your password immediately and contact support.

– Retail Shield Security Team`
        });

      } catch (emailErr) {
        console.error("❌ Failed to send suspicious login alert:", emailErr.message);
      }

      // Return redirect flag and security question
      return res.status(403).json({
        message: "Suspicious biometric behavior. Please answer your security question.",
        redirectToSecurityQuestion: true,
        question: user.securityQuestion
      });
    }

    let complianceScore = 0;

    // if (passwordStrength === "strong") complianceScore += 30;
    // else if (passwordStrength === "medium") complianceScore += 15;

    if (prediction === "valid") complianceScore += 50;

    if (agreementChecked === true) complianceScore += 20;

    complianceScore += 10;

    if (complianceScore > 100) complianceScore = 100;

    // ✅ All good, update pattern and flags
    if (prediction === "valid") {
      await User.findByIdAndUpdate(user._id, {
        biometricProfile: typingPattern,
        isLastBiometricValid: true,
        agreementChecked: agreementChecked === true,
        // passwordStrength,
        complianceScore
      });
    }

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
        // passwordStrength,

        complianceScore
      },
    });
  } catch (err) {
    console.error("🔥 Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};



export const requestOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, timestamp: Date.now() };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'retailshield864@gmail.com', pass: process.env.APP_PASSWORD }
  });

 const mailOptions = {
  from: 'RetailShield <retailshield864@gmail.com>',
  to: email,
  subject: 'RetailShield OTP - Apply Your Transformation',
  text: `Hi ${user.name},

Your one-time password (OTP) request has been generated successfully.

⚠️ Important: This is your base OTP — it is not valid as-is.

To complete verification, you must apply the OTP transformation method you selected during registration (e.g., reverse, prefix, or digit shift). Only the correctly transformed version will be accepted by the system.

🧠 Base OTP: ${otp}

If you did not request this OTP or suspect unauthorized activity, please contact support immediately.

– Retail Shield Security Team`
};

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.status(500).json({ message: 'Failed to send OTP' });
    res.json({ message: 'OTP sent' });
  });
};

export const verifyOtp = async (req, res) => {
const { email, otp } = req.body;

const record = otpStore[email];
if (!record || Date.now() - record.timestamp > 5 * 60 * 1000) {
return res.status(400).json({ message: 'OTP expired or invalid' });
}

const baseOtp = record.otp;
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: 'User not found' });

let expected = baseOtp;
switch (user.otpTransformation) {
case 'reverse':
expected = baseOtp.split('').reverse().join('');
break;
case 'prefix_42':
expected = `42${baseOtp}`;
break;
case 'shift_+1':
expected = baseOtp.split('').map(d => (parseInt(d) + 1) % 10).join('');
break;
case 'shift_-1':
expected = baseOtp.split('').map(d => (parseInt(d) + 9) % 10).join('');
break;
default:
break;
}

// Log everything for debug
console.log("🧠 OTP Debug Logs:");
console.log("User Email:", email);
console.log("Base OTP:", baseOtp);
console.log("Transformation:", user.otpTransformation);
console.log("Expected OTP after transform:", expected);
console.log("User Submitted OTP:", otp);

if (otp !== expected) {
return res.status(400).json({ message: 'Invalid transformed OTP' });
}

delete otpStore[email];
return res.json({ message: 'OTP verified' });
};



export const resetPassword = async (req, res) => {
const { email, newPassword } = req.body;

const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: "User not found" });

const hashed = await bcrypt.hash(newPassword, 10);
await User.updateOne({ email }, { $set: { password: hashed } });

return res.status(200).json({ message: "Password reset successfully" });
};


export const verifySecurityQuestion = async (req, res) => {
  try {
    const { email, answer } = req.body;

    pgsql
    Copy
    Edit
    if (!email || !answer) {
      return res.status(400).json({ message: "Missing email or answer" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // If no question stored, deny
    if (!user.securityQuestion || !user.securityAnswer) {
      return res.status(400).json({ message: "No security question configured for this user" });
    }

    // Compare lowercase trimmed for flexibility
    const normalizedAnswer = answer.trim().toLowerCase();
    const correctAnswer = user.securityAnswer.trim().toLowerCase();

    if (normalizedAnswer !== correctAnswer) {
      return res.status(401).json({ message: "❌ Incorrect answer. Access denied." });
    }

    // ✅ All good, generate token and return
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        riskScore: user.riskScore || 0,
      },
    });
  } catch (err) {
    console.error("🚨 Security question error:", err.message);
    return res.status(500).json({ message: "Server error during verification" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Failed to fetch user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
