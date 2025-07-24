import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ShieldAlert, ActivitySquare, CheckCircle } from "lucide-react";
const riskColors = {
  low: "#16a34a",
  medium: "#facc15",
  high: "#f97316",
  critical: "#dc2626",
};

const POSMonitor = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  });
  const chartRef = useRef(null);
  const cardRef = useRef(null);
  const dataPanelRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pos/all");
      const logs = res.data.data || [];
      setEvents(logs);
      calculateStats(logs);
    } catch (err) {
      console.error("Failed to fetch POS events", err);
    }
  };

  const calculateStats = (data) => {
    const grouped = {
      total: data.length,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    data.forEach((e) => {
      if (grouped[e.riskLevel] !== undefined) {
        grouped[e.riskLevel]++;
      }
    });

    setStats(grouped);
  };

  const pieData = [
    { name: "Low", value: stats.low },
    { name: "Medium", value: stats.medium },
    { name: "High", value: stats.high },
    { name: "Critical", value: stats.critical },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 24,
          padding: 25,
          font: { size: 16, weight: "bold" },
          color: "#1f2937",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.85)",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
      },
    },
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -4,
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const chartVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const statusVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const getStatusMessages = () => {
    const messages = [];
    if (stats.critical > 0) {
      messages.push({
        text: `⚠️ ${stats.critical} Critical Risk event${stats.critical === 1 ? "" : "s"} detected! Immediate action required.`,
        color: "text-red-600",
        icon: ShieldAlert,
      });
    }
    if (stats.high > 0) {
      messages.push({
        text: `🔔 ${stats.high} High Risk event${stats.high === 1 ? "" : "s"} detected. Monitor closely.`,
        color: "text-orange-600",
        icon: ShieldAlert,
      });
    }
    if (stats.medium > 0) {
      messages.push({
        text: `🔔 ${stats.medium} Medium Risk event${stats.medium === 1 ? "" : "s"} detected. Review recommended.`,
        color: "text-yellow-600",
        icon: ShieldAlert,
      });
    }
    if (stats.low > 0) {
      messages.push({
        text: `✅ ${stats.low} Low Risk event${stats.low === 1 ? "" : "s"} detected. System stable.`,
        color: "text-green-600",
        icon: CheckCircle,
      });
    }
    if (messages.length === 0) {
      messages.push({
        text: "✅ No risk events detected. System running smoothly.",
        color: "text-green-600",
        icon: CheckCircle,
      });
    }
    return messages;
  };

  return (
    <div className="w-full p-4 bg-[#f9fafb] h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
        POS Monitor
      </h1>
      <div className="relative flex flex-col flex-1">
        {/* POS Monitor Section */}
        <div
          className=" ml-5 rounded-2xl shadow-md border border-gray-100 p-8 flex-1 mb-[3.75rem]"
          style={{ maxHeight: 'calc(100vh - 2rem - 3rem - 3.75rem)' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <ActivitySquare className="w-7 h-7 text-indigo-600" /> POS Monitor Dashboard
          </h2>
          <div ref={cardRef} className="flex flex-col lg:flex-row gap-6 w-full h-[calc(100% - 3rem)]">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-full">
              <motion.div
                ref={chartRef}
                className="w-full h-[450px]"
                variants={chartVariants}
                initial="initial"
                animate="animate"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={riskColors[entry.name.toLowerCase()]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 1)",
                        borderRadius: "8px",
                        padding: "12px",
                        fontSize: "14px",
                      }}
                      labelStyle={{ fontSize: "16px", fontWeight: "bold" }}
                    />
                    <Legend
                      layout="horizontal"
                      align="center"
                      verticalAlign="bottom"
                      iconSize={24}
                      wrapperStyle={{ paddingTop: "25px", fontSize: "16px", fontWeight: "bold", color: "#1f2937" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
            {/* Data Panel */}
           <div ref={dataPanelRef} className="w-full lg:w-1/2 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-indigo-600" /> Risk Metrics
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-md"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-3">
                      <ActivitySquare className="w-6 h-6 text-blue-500" />
                      <h4 className="text-base font-medium text-gray-700">Total Logs</h4>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-gray-800">{stats.total}</p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-md"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-green-500" />
                      <h4 className="text-base font-medium text-gray-700">Low Risk</h4>
                    </div>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: riskColors.low }}>
                      {stats.low}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-md"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-yellow-500" />
                      <h4 className="text-base font-medium text-gray-700">Medium Risk</h4>
                    </div>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: riskColors.medium }}>
                      {stats.medium}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-md"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-orange-500" />
                      <h4 className="text-base font-medium text-gray-700">High Risk</h4>
                    </div>
                    <p className="mt-3 text-2xl font-semibold" style={{ color: riskColors.high }}>
                      {stats.high}
                    </p>
                  </motion.div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-indigo-600" /> Risk Status
                </h3>
                <div className="mt-3 space-y-2">
                  {getStatusMessages().map((msg, index) => (
                    <motion.p
                      key={index}
                      className={`text-sm font-medium ${msg.color} flex items-center gap-2`}
                      variants={statusVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: index * 0.1 }}
                    >
                      <msg.icon className="w-4 h-4" />
                      {msg.text}
                    </motion.p>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSMonitor;