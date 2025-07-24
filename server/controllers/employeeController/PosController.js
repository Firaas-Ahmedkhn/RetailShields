import POSMonitor from "../../models/employeeDashboard/PosSchema.js";
import AdminNotification from "../../models/AdminDashboard/NotificationSchema.js";
import mongoose, { Types } from "mongoose";


// Create a new POS event


export const createPOSEvent = async (req, res) => {
  try {
    const { terminalId, amount, time } = req.body;
    const fallbackUserId = new Types.ObjectId("6874ef62815f6f2aff74ee74");

    if (!terminalId || !amount || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let status = "success";
    let activityType = "normal";
    let riskLevel = "low";
    let description = "Standard transaction";

    if (amount > 50000) {
      activityType = "high_value_sale";
      riskLevel = "high";
      description = "High value sale detected";
    }

    const hour = parseInt(time.split(":")[0]);
    if (hour >= 0 && hour <= 4) {
      activityType = "suspicious_behavior";
      riskLevel = "medium";
      description = "Transaction occurred at odd hours (12AM–4AM)";
    }

    if (Math.random() < 0.1) {
      status = "failure";
      activityType = "failed_transaction";
      riskLevel = "medium";
      description = "Transaction failed due to system error.";
    } else if (Math.random() < 0.1) {
      status = "void";
      activityType = "void_transaction";
      riskLevel = "high";
      description = "Void transaction triggered.";
    }

    const userId = req.user?.id ? new Types.ObjectId(req.user.id) : fallbackUserId;

    const event = await POSMonitor.create({
      terminalId,
      amount,
      time,
      status,
      activityType,
      riskLevel,
      description,
      userId,
    });

    if (
      riskLevel === "high" ||
      activityType === "suspicious_behavior" ||
      status !== "success"
    ) {
      await AdminNotification.create({
        title: `Unusual POS Activity Detected`,
        message: `${description} at terminal ${terminalId} Amount: ₹${amount}`,
        riskLevel,
        source: "POS",
        userId,
        linkedPOSId: event._id,
      });
    }

    res.json({ message: "POS event logged", event });
  } catch (err) {
    console.error("POS log error:", err);
    res.status(500).json({ error: "Failed to log POS event" });
  }
};



// Get all POS logs
export const getPOSEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const data = await POSMonitor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await POSMonitor.countDocuments();

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch POS logs" });
  }
};

export const getAllPOSLogs = async (req, res) => {
  try {
    const logs = await POSMonitor.find().sort({ createdAt: -1 });

    const stats = {
      total: logs.length,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    logs.forEach((log) => {
      const level = log.riskLevel?.toLowerCase();
      if (stats[level] !== undefined) {
        stats[level]++;
      }
    });

    res.status(200).json({
      success: true,
      data: logs,
      stats,
    });
  } catch (error) {
    console.error("Error fetching POS logs:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};





// Get stats by risk level (for dashboard chart)
export const getPOSStats = async (req, res) => {
  try {
    const stats = await POSMonitor.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch POS stats" });
  }
};
