import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComplianceScore = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored) {
      axios
        .get(`http://localhost:3000/api/auth/users/${stored.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Fetch error:', err.message));
    }
  }, []);

  if (!user) return <div className="text-gray-300 p-6">Loading...</div>;

  const { complianceScore = 0, passwordStrength, agreementChecked, riskScore } = user;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="p-6 min-h-screen bg-white text-white">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
        Compliance Score
      </h1>

      <div className="bg-[#1e293b] p-8 rounded-xl border border-gray-700 shadow-xl max-w-3xl mx-auto">
        {/* Score Circle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <p className="text-gray-400 mb-2 text-sm">Your Current Compliance Score</p>
          <div className={`w-32 h-32 flex items-center justify-center rounded-full border-8 ${getScoreColor(complianceScore)}`}>
            <span className="text-4xl font-extrabold">{complianceScore}%</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-300 mb-8">
          <div className="flex justify-between items-center border-b border-gray-600 pb-2">
            <span>🛡️ Password Strength:</span>
            <span className="text-white font-semibold capitalize">{passwordStrength}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-600 pb-2">
            <span>📋 Agreement Accepted:</span>
            <span className="text-white font-semibold">{agreementChecked ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-600 pb-2">
            <span>🔐 Biometric Risk Score:</span>
            <span className="text-white font-semibold">{riskScore}</span>
          </div>
        </div>

        {/* Suggestions */}
        <h3 className="text-lg font-bold text-white mb-3">📈 How to Improve Your Score</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
          <li>Use a strong password with symbols, numbers, and uppercase letters.</li>
          <li>Ensure you accept the agreement checkbox every login.</li>
          <li>Maintain a consistent typing pattern for biometric trust.</li>
          <li>Login from your registered IP or trusted device regularly.</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplianceScore;
