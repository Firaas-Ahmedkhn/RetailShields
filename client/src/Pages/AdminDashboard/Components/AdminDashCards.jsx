import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLock,
  FaBug,
  FaShieldAlt,
  FaUserSecret,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center text-gray-400 text-lg mt-10">
        Fetching dashboard data...
      </div>
    );
  }

  const Card = ({ icon, title, value, subtitle, bg, border, color }) => (
    <motion.div
      className={`rounded-xl p-4 flex flex-col gap-2 shadow-md ${bg} ${border}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center gap-3">
        <div className={`${color} text-xl`}>{icon}</div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <h1 className="text-3xl font-bold">{value}</h1>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </motion.div>
  );

  // ✅ Sum total threats from threatsOverTime
  const totalThreats = stats.threatsOverTime.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <Card
        icon={<FaLock />}
        title="Failed Login Attempts"
        value={stats.failedLogins}
        subtitle="Today’s attempts"
        bg="bg-red-50"
        border="border border-red-200"
        color="text-red-500"
      />
      <Card
        icon={<FaBug />}
        title="Active Security Incidents"
        value={stats.activeThreats}
        subtitle="Real-time threats"
        bg="bg-yellow-50"
        border="border border-yellow-200"
        color="text-yellow-600"
      />
      <Card
        icon={<FaShieldAlt />}
        title="Total Threats"
        value={totalThreats}
        subtitle={`Across ${stats.threatsOverTime.length} days`}
        bg="bg-blue-50"
        border="border border-blue-200"
        color="text-blue-600"
      />
      <Card
        icon={<FaUserSecret />}
        title="Unusual Activities"
        value={stats.unusualActivityCount}
        subtitle={
          stats.unusualActivities[0]?.description || "No recent anomaly"
        }
        bg="bg-purple-50"
        border="border border-purple-200"
        color="text-purple-600"
      />
    </div>
  );
};

export default AdminDashCards;
