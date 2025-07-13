import POSMonitor from "../../models/employeeDashboard/PosSchema.js";

// Create a new POS event
export const createPOSEvent = async (req, res) => {
  try {
    const { terminalId, amount, time } = req.body;

    if (!terminalId || !amount || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Default status
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

    // Simulate failed/void transactions randomly for demo (you can skip in prod)
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

    const event = await POSMonitor.create({
      terminalId,
      amount,
      time,
      status,
      activityType,
      riskLevel,
      description,
    });

    res.json({ message: "POS event logged", event });
  } catch (err) {
    console.error("POS log error:", err);
    res.status(500).json({ error: "Failed to log POS event" });
  }
};


// Get all POS logs
export const getPOSEvents = async (req, res) => {
  try {
    const data = await POSMonitor.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch POS logs" });
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
