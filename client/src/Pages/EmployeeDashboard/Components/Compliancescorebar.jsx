import  { useEffect, useState } from 'react';
// import ComplianceScore from './ComplianceScore';
import axios from 'axios';
import { motion } from 'framer-motion';

const getScoreBadge = (score) => {
  if (score >= 80) return { label: '✅ Compliant', color: 'bg-green-500' };
  if (score >= 50) return { label: '⚠️ Partially Compliant', color: 'bg-yellow-400' };
  return { label: '❌ Poor Compliance', color: 'bg-red-500' };
};

 

const Compliancescorebar = () => {
      const [user, setUser] = useState('');




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

       const { complianceScore = 0 } = user;
      const badge = getScoreBadge(complianceScore);
  return (
   <motion.div
        className="mt-10 bg-white p-6 rounded-lg shadow-lg border border-gray-200"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Compliance Overview</h2>
          <span className={`px-4 py-1 text-sm rounded-full ${badge.color} text-white`}>
            {badge.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-3 rounded-full mb-3">
          <motion.div
            className={`${badge.color} h-3 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${complianceScore}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Your compliance score is <span className="font-bold text-black">{complianceScore}%</span> based on password strength,
          agreement status, biometric confidence and secure login behavior.
        </p>

        <button
          onClick={() => navigate('/compliance-score')}
          className="mt-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          View How to Improve →
        </button>
      </motion.div>
  )
}

export default Compliancescorebar
