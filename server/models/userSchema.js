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
  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
  biometricProfile: {
    type: [Number], // typing pattern vector
    default: [],
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
  agreementChecked: {
    type: Boolean,
    default: false,
  },

  passwordStrength: {
    type: String,
    enum: ["weak", "medium", "strong"],
    default: "weak",
  },

  isLastBiometricValid: {
    type: Boolean,
    default: false,
  },

  phishingTrainingCompleted: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
