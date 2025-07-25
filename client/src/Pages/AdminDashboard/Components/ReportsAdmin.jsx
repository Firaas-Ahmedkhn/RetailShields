import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const SuspiciousUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/auth/sususers?search=${search}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // ✅ CSV Export Handler
  const handleDownloadCSV = () => {
    if (users.length === 0) return;

    const csvData = users.map((user) => {
      const latestThreat = user.threatLogs?.slice(-1)[0];
      return {
        Name: user.name,
        Email: user.email,
        "Failed Logins": user.failedLoginAttempts,
        Threats: user.threats,
        "Risk Score": user.riskScore,
        "Password Strength": user.passwordStrength,
        "Last Threat Time": latestThreat ? dayjs(latestThreat.timestamp).format("DD MMM YYYY, HH:mm") : "—",
        IP: latestThreat?.ip || user.registeredIp || "—"
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `suspicious_users_${dayjs().format("YYYY-MM-DD_HH-mm")}.csv`);
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Suspicious User Report
      </h1>

      <div className="flex justify-between mb-4 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or email"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-150"
          onClick={handleDownloadCSV}
        >
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500 animate-pulse">Loading...</div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No suspicious users found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-200 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Failed Logins</th>
                <th className="px-4 py-2">Threats</th>
                <th className="px-4 py-2">Risk Score</th>
                <th className="px-4 py-2">Password Strength</th>
                <th className="px-4 py-2">Last Threat Time</th>
                <th className="px-4 py-2">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const latestThreat = user.threatLogs?.slice(-1)[0];
                return (
                  <tr key={user._id}>
                    <td className="px-4 py-2 font-medium">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.failedLoginAttempts}</td>
                    <td className="px-4 py-2">{user.threats}</td>
                    <td className="px-4 py-2">{user.riskScore}</td>
                    <td className="px-4 py-2 capitalize">{user.passwordStrength}</td>
                    <td className="px-4 py-2">
                      {latestThreat ? dayjs(latestThreat.timestamp).format("DD MMM YYYY, HH:mm") : "—"}
                    </td>
                    <td className="px-4 py-2">{latestThreat?.ip || user.registeredIp || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SuspiciousUsers;
