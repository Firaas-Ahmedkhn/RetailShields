// server/models/Dashboard.js
import mongoose from "mongoose";

const SystemHealthSchema = new mongoose.Schema({
  cpuUsage: {
    type: Number,
    required: true,
  },
  memoryUsage: {
    type: Number,
    required: true,
  },
  storageStatus: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ThreatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  description: {
    type: String,
    required: true,
  },
});

const LoginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: String,
    default: "Unknown",
  },
  device: {
    type: String,
    default: "Unknown",
  },
});

export const SystemHealth = mongoose.model("SystemHealth", SystemHealthSchema);
export const Threat = mongoose.model("Threat", ThreatSchema);
export const LoginActivity = mongoose.model("LoginActivity", LoginActivitySchema);
