import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FaMoneyBillWave, FaClock, FaServer } from 'react-icons/fa';

const POSSimulator = () => {
  const [terminalId, setTerminalId] = useState('');
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/pos/log', {
        terminalId,
        amount: parseFloat(amount),
        time,
      });

      const { event } = response.data;

      toast.success(
        `🧾 Logged POS event — ${event.activityType.toUpperCase()} | Risk: ${event.riskLevel.toUpperCase()} | Status: ${event.status.toUpperCase()}`,
        { duration: 5000 }
      );

      setTerminalId('');
      setAmount('');
      setTime('');
    } catch (err) {
      console.error("POS log error:", err);
      toast.error("❌ Failed to log POS event. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <Toaster />

      {/* Left Section */}
      <div className="md:w-1/2 flex flex-col justify-center items-start p-12 bg-white">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          POS Simulator
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          This simulator helps you mimic Point-of-Sale (POS) terminal activity by entering terminal ID,
          transaction amount, and the time of transaction. It logs the event and evaluates the risk level based on simulated backend logic.
        </p>
        <p className="text-gray-500 mt-4 text-sm italic">
          Useful for fraud detection simulations, system monitoring, or demo environments.
        </p>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-800 px-6 py-12">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 text-white">
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Simulate Transaction
          </h2>

          {/* Terminal ID */}
          <label className="block mb-1 text-sm text-gray-300 flex items-center gap-2">
            <FaServer /> Terminal ID
          </label>
          <input
            value={terminalId}
            onChange={(e) => setTerminalId(e.target.value)}
            placeholder="e.g. TML-8821"
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {/* Amount */}
          <label className="block mb-1 text-sm text-gray-300 flex items-center gap-2">
            <FaMoneyBillWave /> Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 90000"
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Time */}
          <label className="block mb-1 text-sm text-gray-300 flex items-center gap-2">
            <FaClock /> Time of Transaction
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600  text-white font-bold rounded-lg hover:scale-105 transition-all"
          >
            🚀 Simulate Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSSimulator;
