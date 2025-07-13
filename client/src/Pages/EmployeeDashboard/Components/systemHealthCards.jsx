// components/SystemHealthCards.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SystemHealthCards = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      const res = await axios.get('http://localhost:3000/api/empdash/system-health');
      setHealth(res.data);
    };
    fetchHealth();
  }, []);

  if (!health) return <p className="text-gray-500">Loading system health...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* CPU Usage */}
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">CPU Usage</h3>
        <p className="text-3xl font-bold text-blue-600">{health.cpuUsage}%</p>
      </div>

      {/* Memory Usage */}
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Memory Usage</h3>
        <p className="text-3xl font-bold text-purple-600">{health.memoryUsage}%</p>
      </div>

      {/* Storage Health */}
      <div className="bg-white rounded-lg p-6 shadow-md text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Storage</h3>
        <p className={`text-2xl font-bold ${health.storageStatus === "Healthy" ? "text-green-500" : "text-red-500"}`}>
          {health.storageStatus}
        </p>
      </div>
    </div>
  );
};

export default SystemHealthCards;
