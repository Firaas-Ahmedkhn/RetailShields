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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [currentPage]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/pos/logs?page=${currentPage}`);
      setLogs(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.terminalId?.toLowerCase().includes(search.toLowerCase())
  );

  const shimmerRow = (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
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
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>{shimmerRow}</React.Fragment>
                ))
              : filteredLogs.length > 0
              ? filteredLogs.map((log, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{log.terminalId}</td>
                    <td className="px-4 py-2">₹{log.amount}</td>
                    <td className="px-4 py-2">{log.time}</td>
                    <td className="px-4 py-2">{log.status}</td>
                    <td
                      className="px-4 py-2 font-semibold"
                      style={{ color: riskColors[log.riskLevel] }}
                    >
                      {log.riskLevel?.toUpperCase()}
                    </td>
                    <td className="px-4 py-2">{log.activityType}</td>
                    <td className="px-4 py-2">{log.description}</td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No logs found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* ⏩ Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EventLogs;
