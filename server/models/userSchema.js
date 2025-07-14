// server/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },

  securityQuestion: {
    type: String,
    default: "What is your favorite color?"
  },
  securityAnswer: {
    type: String,
    required: false,
  },

  lockUntil: {
    type: Date,
    default: null,
  },
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  biometricProfile: {
    type: [Number], // typing pattern vector
    default: [],
  },

  complianceScore: {
    type: Number,
    default: 0,
  },
  passwordStrength: {
    type: String,
    enum: ["weak", "medium", "strong"],
    default: "weak"
  },
  agreementChecked: {
    type: Boolean,
    default: false,
  },
  riskScore: {
    type: Number,
    default: 0,

  },
  otpTransformation: {
    type: String,
    enum: ["reverse", "prefix_42", "shift_+1", "shift_-1"],
    required: true,
  },
  phishingScore: {
    type: Number,
    default: 0,
  },
  registeredIp: {
    type: String,
    default: '', // optional initially
  },


}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
