import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SystemHealthCards from './systemHealthCards';
import ComplianceScore from './ComplianceScore';
import { motion } from 'framer-motion';
import Compliancescorebar from './Compliancescorebar';
import BiometricChart from "./BiometricScoreChart"

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

    if (!storedUser || !token) return;

    try {
      const parsedUser = JSON.parse(storedUser);

      axios
        .get(`http://localhost:3000/api/auth/users/${parsedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Fetch error:", err.response?.data || err.message));
    } catch (err) {
      console.error("Error parsing user from localStorage", err);
    }
  }, []);

  if (!user) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { complianceScore = 0 } = user;
  const badge = getScoreBadge(complianceScore);

  return (
    <motion.div
      className="p-6 min-h-screen bg-[#f9fafb] text-black"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
        Dashboard Overview
      </h1>

      <SystemHealthCards />
      {/* <BiometricChart /> */}
      {/* <Compliancescorebar /> */}

     

      
    </motion.div>
  );
};

export default MainDashboard;
