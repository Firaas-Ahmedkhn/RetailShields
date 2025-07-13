import React from 'react';

const ComplianceScore = () => {
  return (
    <div className="p-6 min-h-screen bg-white rounded-lg text-black">
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Compliance Score
      </h1>
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-2">Your current compliance score is:</p>
        <div className="text-6xl font-extrabold text-green-500">92%</div>
      </div>
    </div>
  );
};

export default ComplianceScore;
