import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/vendor/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch vendor logs:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f9fafb] text-black">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Vendor Logs
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
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
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No vendor logs yet.
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-2 font-medium">{log.vendorName}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.ipAddress || "N/A"}</td>
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorLogs;
