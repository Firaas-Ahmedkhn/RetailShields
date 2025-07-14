import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SystemHealthCards from './systemHealthCards';
import ComplianceScore from './ComplianceScore';

const getScoreBadge = (score) => {
  if (score >= 80) return { label: '✅ Compliant', color: 'bg-green-500' };
  if (score >= 50) return { label: '⚠️ Partially Compliant', color: 'bg-yellow-400' };
  return { label: '❌ Poor Compliance', color: 'bg-red-500' };
};

const MainDashboard = () => {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      console.warn("User or token missing in localStorage");
      return;
    }

    let parsedUser = null;

    try {
      parsedUser = JSON.parse(storedUser);
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
      return;
    }

    console.log("Parsed user:", parsedUser);

    axios
      .get(`http://localhost:3000/api/auth/users/${parsedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("Fetched user data:", res.data);
        setUser(res.data);
        console.log("My log",);

      })
      .catch((err) => {
        console.error("Fetch error:", err.response?.data || err.message);
      });
  }, []);

  console.log(localStorage.getItem('token'));


  if (!user) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { complianceScore = 0 } = user;
  const badge = getScoreBadge(complianceScore);

  return (
    <div className="p-6 min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
        Dashboard Overview
      </h1>

      <SystemHealthCards />

      {/* 🔒 Compliance Score */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold ">Compliance Overview</h2>
          <span className={`px-4 py-1 text-sm rounded-full ${badge.color} text-white`}>
            {badge.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200  h-4 rounded-full mb-3">
          <div
            className={`${badge.color} h-4 rounded-full`}
            style={{ width: `${complianceScore}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Your compliance score is <span className="font-bold text-black">{user.complianceScore
          }%</span> based on password strength,
          agreement status, biometric confidence and secure login behavior.
        </p>

        <button
          onClick= <ComplianceScore />
          className="mt-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          View How to Improve →
        </button>
      </div>
    </div>
  );
};

export default MainDashboard;
