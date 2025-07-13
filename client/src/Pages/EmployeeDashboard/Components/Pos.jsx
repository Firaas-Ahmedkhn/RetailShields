import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ShieldAlert, ActivitySquare } from "lucide-react";

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pos/logs");
      setEvents(res.data);
      calculateStats(res.data);
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

  return (
    <div className="p-6 min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        POS Monitor
      </h1>

      {/* 📊 Stats Cards (Horizontal Row) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white shadow-md p-4 rounded-lg flex items-center gap-3">
          <ActivitySquare className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Logs</p>
            <h2 className="text-xl font-semibold">{stats.total}</h2>
          </div>
        </div>
        {["low", "medium", "high", "critical"].map((key) => (
          <div key={key} className="bg-white shadow-md p-4 rounded-lg flex items-center gap-3">
            <ShieldAlert className="text-red-400" />
            <div>
              <p className="text-sm text-gray-500 capitalize">{key} Risk</p>
              <h2 className="text-xl font-semibold" style={{ color: riskColors[key] }}>{stats[key]}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* 🧠 Risk Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
        <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={riskColors[entry.name.toLowerCase()]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default POSMonitor;
