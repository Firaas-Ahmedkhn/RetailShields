// controllers/dashboardController.js
import { SystemHealth, Threat, LoginActivity } from '../../models/employeeDashboard/DashboardSchema.js';
import os from "os";

// POST or UPDATE system health (admin/backend tool)
export const updateSystemHealth = async (req, res = null) => {
  try {
    const cpuLoad = os.loadavg()[0]; // 1-min average
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

    const storageStatus =
      memoryUsage > 90 ? 'Critical' : memoryUsage > 70 ? 'Warning' : 'Healthy';

    const healthData = {
      cpuUsage: parseFloat(cpuLoad.toFixed(2)),
      memoryUsage: parseFloat(memoryUsage.toFixed(2)),
      storageStatus,
      updatedAt: new Date(),
    };

    const existing = await SystemHealth.findOne();
    if (existing) {
      await SystemHealth.updateOne({}, healthData);
    } else {
      await SystemHealth.create(healthData);
    }

    if (res) {
      res.json({ message: '✅ System health updated', data: healthData });
    }
  } catch (err) {
    console.error('System health update error:', err);
    if (res) {
      res.status(500).json({ error: '❌ Failed to update system health' });
    }
  }
};

export const getSystemHealth = async (req, res) => {
  try {
    const health = await SystemHealth.findOne().sort({ updatedAt: -1 });
    res.json(health);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
};
// POST login activity
export const logLoginActivity = async (req, res) => {
  try {
    const { userId, location, device } = req.body;
    await LoginActivity.create({ userId, location, device });
    res.json({ message: "Login activity recorded" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log activity" });
  }
};

// GET dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const systemHealth = await SystemHealth.findOne();
    const threatsThisWeek = await Threat.find({
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    const loginActivity = await LoginActivity.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'name email');

    res.json({
      systemHealth,
      threats: threatsThisWeek,
      loginActivity,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
