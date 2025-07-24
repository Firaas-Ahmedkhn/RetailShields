import User from '../../models/userSchema.js';
import POSMonitor from '../../models/employeeDashboard/PosSchema.js';



export const getAdminStats = async (req, res) => {
  try {
    // 1. Count users with at least 1 failed login
    const failedLoginCount = await User.countDocuments({
      failedLoginAttempts: { $gt: 0 }
    });

    // 2. Count high-risk POS activities
    const highRiskCount = await POSMonitor.countDocuments({ riskLevel: "high" });

    // 3. Fetch recent high-risk POS activities (limit to 5)
    const recentHighRiskActivities = await POSMonitor.find({ riskLevel: "high" })
      .sort({ timestamp: -1 })
      .limit(5);

    // 4. Get total threats from all users
    const threatAgg = await User.aggregate([
      {
        $group: {
          _id: null,
          totalThreats: { $sum: "$threats" }
        }
      }
    ]);
    const totalThreats = threatAgg[0]?.totalThreats || 0;

    // 5. Get threats over time (for graphing)
    const threatsOverTime = await User.aggregate([
      { $unwind: "$threatLogs" }, // break array into docs
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$threatLogs.timestamp"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 6. Final stats object
    const stats = {
      failedLogins: failedLoginCount,
      activeThreats: totalThreats,
      threatsBreakdown: {}, // reserved for future analytics like by threat type
      unusualActivityCount: highRiskCount,
      unusualActivities: recentHighRiskActivities,
      threatsOverTime: threatsOverTime
    };

    res.status(200).json(stats);
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

export const getPOSActivityDistribution = async (req, res) => {
  try {
    const activityStats = await POSMonitor.aggregate([
      {
        $group: {
          _id: "$activityType",
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(activityStats);
  } catch (err) {
    console.error("Failed to fetch activity distribution:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};






