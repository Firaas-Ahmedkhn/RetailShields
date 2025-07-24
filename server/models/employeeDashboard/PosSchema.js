// models/POSMonitor.js
import mongoose from "mongoose";

const POSMonitorSchema = new mongoose.Schema(
  {
    terminalId: { type: String, required: true },
    amount: { type: Number, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["success", "failure", "void"],
      required: true,
    },
    activityType: {
      type: String,
      enum: [
        "login_attempt",
        "void_transaction",
        "high_value_sale",
        "failed_transaction",
        "suspicious_behavior",
        "normal",
      ],
      required: true,
    },
    description: { type: String },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const POSMonitor = mongoose.model("POSMonitor", POSMonitorSchema);
export default POSMonitor;
