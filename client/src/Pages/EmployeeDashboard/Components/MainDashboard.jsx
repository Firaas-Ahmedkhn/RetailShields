import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SystemHealthCards from './systemHealthCards';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const getScoreBadge = (score) => {
  if (score >= 80) return { label: '✅ Compliant', color: 'bg-green-500' };
  if (score >= 50) return { label: '⚠️ Partially Compliant', color: 'bg-yellow-400' };
  return { label: '❌ Poor Compliance', color: 'bg-red-500' };
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const MainDashboard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [adminCheck, setadminCheck] = useState(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const isadmin = localStorage.getItem("user");
      const parsedadmin = JSON.parse(isadmin);
      setadminCheck(parsedadmin);

      try {
        const res = await axios.get(`http://localhost:3000/api/auth/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (nameRef.current) {
      gsap.fromTo(nameRef.current, 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, [user]);

  if (!user) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { complianceScore = 0, name = '' } = user;
  const badge = getScoreBadge(complianceScore);
  const greeting = getGreeting();

  return (
    <motion.div
      className="p-6 min-h-screen bg-[#f9fafb] text-black"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-2xl font-semibold text-gray-700">{greeting},</h2>
          <p
            ref={nameRef}
            className="text-xl text-gray-600"
          >
            {name}
          </p>
        </motion.div>
      </div>

      <SystemHealthCards />

      {adminCheck?.role === 'admin' && (
        <motion.button
          onClick={() => navigate('/admin-dashboard')}
          initial={{ width: 50 }}
          whileHover={{ width: 240 }}
          className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-full shadow-lg flex items-center overflow-hidden transition-all duration-300 hover:bg-blue-700 w-100"
        >
          <span className="text-lg mr-2">🛠️</span>
          <span className="whitespace-nowrap">Go to Admin Dashboard</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default MainDashboard;
