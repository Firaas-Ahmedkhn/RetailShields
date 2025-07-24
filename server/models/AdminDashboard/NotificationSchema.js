// models/employeeDashboard/NotificationSchema.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  riskLevel: String,
  source: {
    type: String,
    default: "POS"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Notification", notificationSchema);
