// server/models/VendorLog.js
import mongoose from "mongoose";

const VendorLogSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "file_upload",
      "data_access",
      "failed_login",
      "configuration_change",
      "logout",
    ],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  riskLevel: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  description: String,
});

const VendorLog = mongoose.model("VendorLog", VendorLogSchema);
export default VendorLog;
