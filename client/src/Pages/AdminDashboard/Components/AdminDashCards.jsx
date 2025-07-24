import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLock, FaBug, FaShieldAlt, FaUserSecret } from 'react-icons/fa';

const AdminDashCards = () => {
  const [stats, setStats] = useState({
    failedLogins: 0,
    activeThreats: 0,
    threatsBreakdown: {},
    unusualActivityCount: 0,
    unusualActivities: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {/* Failed Login Attempts */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <FaLock className="text-red-500 text-xl" />
          <h2 className="font-semibold">Failed Login Attempts</h2>
        </div>
        <h1 className="text-3xl font-bold">{stats.failedLogins}</h1>
        <p className="text-sm text-gray-500">Today’s attempts</p>
      </div>

      {/* Active Threats */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <FaBug className="text-yellow-600 text-xl" />
          <h2 className="font-semibold">Active Security Incidents</h2>
        </div>
        <h1 className="text-3xl font-bold">{stats.activeThreats}</h1>
        <p className="text-sm text-gray-500">Real-time threats</p>
      </div>

      {/* Weekly Threats */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-blue-600 text-xl" />
          <h2 className="font-semibold">Threats </h2>
        </div>
        <h1 className="text-3xl font-bold">
          {Object.values(stats.activeThreats).reduce((a, b) => a + b, 0)}
        </h1>
         <p className="text-sm text-gray-500">Total threats</p>
        <p className="text-sm text-gray-500">
          {Object.entries(stats.activeThreats).map(([type, count]) => (
            <span key={type}>{type}: {count} | </span>
          ))}
        </p>
      </div>

      {/* Unusual User Activities */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <FaUserSecret className="text-purple-600 text-xl" />
          <h2 className="font-semibold">Unusual Activities</h2>
        </div>
        <h1 className="text-3xl font-bold">{stats.unusualActivityCount}</h1>
        <p className="text-sm text-gray-500">
          {stats.unusualActivities[0]?.description || 'No recent anomaly'}
        </p>
      </div>
    </div>
  );
};

export default AdminDashCards;
