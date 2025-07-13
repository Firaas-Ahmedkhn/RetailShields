import VendorLog from "../../models/employeeDashboard/VendorlogsSchema.js";


export const createVendorLog = async (req, res) => {
  try {
    const { vendorName, action, ipAddress } = req.body;

    let riskLevel = "low";
    let description = "Standard vendor action";

    // Auto-generate risk levels based on action
    switch (action) {
      case "failed_login":
        riskLevel = "medium";
        description = "Multiple failed login attempts detected";
        break;
      case "configuration_change":
        riskLevel = "high";
        description = "Vendor changed system settings";
        break;
      case "data_access":
        riskLevel = "medium";
        description = "Vendor accessed sensitive data";
        break;
      case "file_upload":
        riskLevel = "high";
        description = "File uploaded by vendor";
        break;
      default:
        riskLevel = "low";
        description = "Routine vendor action";
    }

    const log = await VendorLog.create({
      vendorName,
      action,
      ipAddress,
      riskLevel,
      description,
    });

    res.status(200).json({ message: "Vendor action logged", log });
  } catch (err) {
    console.error("Vendor log error:", err);
    res.status(500).json({ error: "Failed to log vendor activity" });
  }
};

// Get all vendor logs
export const getVendorLogs = async (req, res) => {
  try {
    const logs = await VendorLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendor logs" });
  }
};
