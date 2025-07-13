import React, { useEffect, useState } from "react";
import axios from "axios";

const riskColors = {
  low: "#16a34a",
  medium: "#facc15",
  high: "#f97316",
  critical: "#dc2626",
};

const EventLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pos/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.terminalId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] text-black">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        POS Event Logs
      </h1>

      {/* 🔍 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Terminal ID"
          className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📄 Logs Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Terminal ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Risk</th>
              <th className="px-4 py-2">Activity</th>
              <th className="px-4 py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{log.terminalId}</td>
                <td className="px-4 py-2">₹{log.amount}</td>
                <td className="px-4 py-2">{log.time}</td>
                <td className="px-4 py-2">{log.status}</td>
                <td className="px-4 py-2 font-semibold" style={{ color: riskColors[log.riskLevel] }}>
                  {log.riskLevel.toUpperCase()}
                </td>
                <td className="px-4 py-2">{log.activityType}</td>
                <td className="px-4 py-2">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-6 text-gray-400">No logs found.</div>
        )}
      </div>
    </div>
  );
};

export default EventLogs;
