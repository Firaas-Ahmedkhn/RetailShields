import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/vendor/logs");
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch vendor logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.vendorName?.toLowerCase().includes(search.toLowerCase())
  );

  const shimmerRow = (
    <tr className="animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] text-black">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Vendor Logs
      </h1>

      {/* 🔍 Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Vendor Name"
          className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📄 Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Vendor Name</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>{shimmerRow}</React.Fragment>
                ))
              : filteredLogs.length > 0
              ? filteredLogs.map((log, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">
                      {log.vendorName || "N/A"}
                    </td>
                    <td className="px-4 py-2">{log.action || "N/A"}</td>
                    <td className="px-4 py-2">{log.ipAddress || "N/A"}</td>
                    <td className="px-4 py-2">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No vendor logs found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorLogs;
