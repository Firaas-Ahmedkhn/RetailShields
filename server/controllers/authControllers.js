import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import nodemailer from "nodemailer"
import zxcvbn from "zxcvbn";

let otpStore = {};

const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
const BIOMETRIC_API_URL = process.env.BIOMETRIC_API_URL



import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";

// ⏬ ADD this at the top if not already
import User from "../models/User.js"; // your Mongoose model
import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";

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
      securityAnswer,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !biometricProfile ||
      !otpTransformation ||
      !securityAnswer
    ) {
      return res.status(400).json({ message: "Missing or invalid input" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

    const strengthScore = zxcvbn(password).score;
    let passwordStrength = "weak";
    if (strengthScore >= 4) passwordStrength = "strong";
    else if (strengthScore >= 2) passwordStrength = "medium";

    let complianceScore = 0;
    if (passwordStrength === "strong") complianceScore += 30;
    else if (passwordStrength === "medium") complianceScore += 15;

    let ip = req.body.registeredIp;
    if (!ip || ip.trim() === "") {
      ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
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
      agreementChecked: agreementChecked === true,
      securityAnswer: hashedSecurityAnswer,
    });

    // 🔁 REGISTER FACE with FastAPI
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post(
      `http://localhost:8000/register-face?user_id=${newUser._id}`,
      form,
      { headers: form.getHeaders() }
    );

    if (response?.data?.message && response.data._id) {
     
      const fastapiUser = await axios.get(`http://localhost:8000/get-user-embedding/${newUser._id}`);
      const embedding = fastapiUser?.data?.embedding;

      if (embedding) {
        await User.findByIdAndUpdate(newUser._id, { EmbeddingVector: embedding });
      }
    }

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || !req.file) {
      return res.status(400).json({ message: "Missing credentials or face image" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));

    const response = await axios.post("http://localhost:8000/verify-face", form, {
      headers: form.getHeaders(),
    });

    const { _id: matchedId, score, prediction } = response.data;

    if (matchedId !== user._id.toString()) {
      return res.status(401).json({ message: "Face does not match with user." });
    }

    if (prediction !== "valid") {
      return res.status(403).json({ message: `Access denied: ${prediction}` });
    }

    res.status(200).json({ message: "Login successful", score, prediction });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
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


// export const verifySecurityQuestion = async (req, res) => {
//   try {
//     const { email, answer } = req.body;

//     pgsql
//     Copy
//     Edit
//     if (!email || !answer) {
//       return res.status(400).json({ message: "Missing email or answer" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // If no question stored, deny
//     if (!user.securityQuestion || !user.securityAnswer) {
//       return res.status(400).json({ message: "No security question configured for this user" });
//     }

//     // Compare lowercase trimmed for flexibility
//     const normalizedAnswer = answer.trim().toLowerCase();
//     const correctAnswer = user.securityAnswer.trim().toLowerCase();

//     if (normalizedAnswer !== correctAnswer) {
//       return res.status(401).json({ message: "❌ Incorrect answer. Access denied." });
//     }

//     // ✅ All good, generate token and return
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         riskScore: user.riskScore || 0,
//       },
//     });
//   } catch (err) {
//     console.error("🚨 Security question error:", err.message);
//     return res.status(500).json({ message: "Server error during verification" });
//   }
// };


export const getUserById = async (req, res) => {
  const { id } = req.params; // <-- ID from URL
  try {
    const user = await User.findById(id).select('-password -securityAnswer');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET: All users
// GET /api/auth/users?search=&role=&page=1&limit=10

export const getAllUsers = async (req, res) => {
  try {
    const { search = "", role, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (role && ["admin", "employee"].includes(role)) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// PUT: Update user
export const updateUser = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




export const getSuspiciousLogins = async (req, res) => {
  try {
    const userId = req.query.id; // Get userId from query string
    console.log("User ID from localStorage (query):", userId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("User's threat logs:", user.threatLogs);

    const formattedLogs = (user.threatLogs || []).map(log => ({
      time: log.timestamp,
      ip: log.ip,
      type: log.type,
      biometricScore: log.biometricScore,
      email: user.email
    }));

    res.status(200).json(formattedLogs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getSuspiciousUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;

    // Main suspicious activity filters
    const suspiciousFilter = {
      $or: [
        { failedLoginAttempts: { $gt: 0 } },
        { threats: { $gt: 0 } },
        { "threatLogs.0": { $exists: true } }
      ]
    };

    // Search condition
    const searchFilter = search
      ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
      : {};

    // Combine both if search is applied
    const finalQuery = search
      ? { $and: [suspiciousFilter, searchFilter] }
      : suspiciousFilter;

    const users = await User.find(finalQuery).sort({ updatedAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching suspicious users", error: err });
  }
};


export const verifySecurityQuestion = async (req, res) =>{
  const { email, answer } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(answer, user.securityAnswer);

    if (!isMatch) {
      return res.status(401).json({ message: "Security answer is incorrect" });
    }

    // ✅ Generate token like login
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateEmbeddingVector = async (req, res) => {
  const { userId, embeddingVector } = req.body;

  if (!userId || !Array.isArray(embeddingVector)) {
    return res.status(400).json({ message: "userId and valid embeddingVector are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { EmbeddingVector: embeddingVector },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Embedding vector updated", user });
  } catch (err) {
    console.error("Error updating embedding vector:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
