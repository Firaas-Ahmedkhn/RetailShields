import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Clock, Cpu, MemoryStick } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const SystemHealthCards = () => {
  const [health, setHealth] = useState(null);
  const [suspiciousLogin, setSuspiciousLogin] = useState(null);
  const [markAsRead, setMarkAsRead] = useState(
    localStorage.getItem("markAsRead") === "true" || false
  );
  const chartRef = useRef(null);
  const cardRef = useRef(null);
  const dataPanelRef = useRef(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/empdash/system-health');
        console.log('System Health Data:', res.data);
        setHealth(res.data);
      } catch (err) {
        console.error('Failed to fetch system health:', err);
        setHealth({ cpuUsage: 0, memoryUsage: 0, storageStatus: 'Healthy', updatedAt: new Date() });
      }
    };

    const fetchSuspiciousLogin = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id;
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        if (markAsRead) {
          setSuspiciousLogin("none");
          return;
        }

        const res = await axios.get(`http://localhost:3000/api/auth/suslogin?id=${userId}`);
        if (res.data.length > 0) {
          const latest = res.data[res.data.length - 1];
          setSuspiciousLogin(latest);
        } else {
          setSuspiciousLogin("none");
        }
      } catch (err) {
        console.error("Failed to fetch suspicious login:", err);
        setSuspiciousLogin("none");
      }
    };

    fetchHealth();
    fetchSuspiciousLogin();
  }, [markAsRead]);

  useEffect(() => {
    if (health && chartRef.current && cardRef.current && dataPanelRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        chartRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'elastic.out(1, 0.7)' }
      );

      gsap.fromTo(
        dataPanelRef.current.children,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.5, delay: 0.4, ease: 'power2.out' }
      );
    }
  }, [health]);

  const handleMarkAsRead = () => {
    if (suspiciousLogin && suspiciousLogin !== "none") {
      setMarkAsRead(true);
      localStorage.setItem("markAsRead", "true");
      setSuspiciousLogin("none");
    }
  };

  if (!health) {
    return <p className="text-gray-500 text-center py-8">Loading system health...</p>;
  }

  const getStatusMessages = () => {
    const messages = [];
    if (health.cpuUsage > 90) {
      messages.push({ text: '⚠️ High CPU Usage: System under heavy load!', color: 'text-red-600' });
    } else if (health.cpuUsage > 70) {
      messages.push({ text: '🔔 Elevated CPU Usage: Monitor performance', color: 'text-yellow-600' });
    }

    if (health.memoryUsage > 90) {
      messages.push({ text: '⚠️ Memory Critical: Free up resources!', color: 'text-red-600' });
    } else if (health.memoryUsage > 70) {
      messages.push({ text: '🔔 High Memory Usage: Consider optimization', color: 'text-yellow-600' });
    }

    if (health.storageStatus === 'Critical') {
      messages.push({ text: '⚠️ Storage Critical: Free up disk space!', color: 'text-red-600' });
    } else if (health.storageStatus === 'Warning') {
      messages.push({ text: '🔔 Storage Warning: Low disk space', color: 'text-yellow-600' });
    }

    return messages.length > 0 ? messages : [{ text: '✅ System running smoothly', color: 'text-green-600' }];
  };

  const pieChartData = {
    labels: ['CPU Usage', 'Memory Usage', 'Storage'],
    datasets: [
      {
        label: 'System Health %',
        data: [
          health.cpuUsage || 0,
          health.memoryUsage || 0,
          health.storageStatus === 'Healthy' ? 100 : health.storageStatus === 'Warning' ? 75 : 50
        ],
        backgroundColor: ['#3b82f6', '#8b5cf6', health.storageStatus === 'Healthy' ? '#10b981' : health.storageStatus === 'Warning' ? '#f59e0b' : '#ef4444'],
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 30,
        hoverBorderWidth: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 24,
          padding: 25,
          font: { size: 16, weight: 'bold' },
          color: '#1f2937'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -4,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full p-6 bg-[#f9fafb] h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <div className="relative flex flex-col flex-1">
        {/* Suspicious Login Section - Top Right */}
        <div className="absolute top-0 right-0 z-10">
          <div className="group relative">
            <div
              className={`flex items-center gap-3 p-4 rounded-lg ${
                suspiciousLogin && suspiciousLogin !== "none" ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {suspiciousLogin && suspiciousLogin !== "none" ? (
                <>
                  <AlertTriangle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Suspicious Login Detected</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">No Suspicious Logins</span>
                </>
              )}
            </div>
            {suspiciousLogin && suspiciousLogin !== "none" && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <p className="text-gray-800 font-medium">IP: {suspiciousLogin.ip}</p>
                <p className="text-gray-800 font-medium">Email: {suspiciousLogin.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Time: {new Date(suspiciousLogin.time).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Score: {(suspiciousLogin.biometricScore * 100).toFixed(1)}%
                </p>
                <button
                  onClick={handleMarkAsRead}
                  className="mt-4 w-full bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Mark as Read
                </button>
              </div>
            )}
          </div>
        </div>

        {/* System Health Section */}
        <div
          className=" rounded-2xl shadow-md border border-gray-100 p-8 flex-1 mb-[3.75rem]"
          style={{ maxHeight: 'calc(100vh - 2rem - 3rem - 3.75rem)' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-indigo-600" /> System Health Dashboard
          </h2>
          <div ref={cardRef} className="flex flex-col lg:flex-row gap-8 w-full h-[calc(100% - 3rem)]">
            {/* Pie Chart */}
            <div className="w-full lg:w-1/2 h-full">
              <div ref={chartRef} className="w-full h-96">
                <Doughnut data={pieChartData} options={chartOptions} />
              </div>
            </div>
            {/* Data Panel */}
            <div ref={dataPanelRef} className="w-full lg:w-1/2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <MemoryStick className="w-5 h-5 text-indigo-600" /> Detailed Metrics
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <motion.div
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-500" />
                      <h4 className="text-sm font-medium text-gray-700">CPU Usage</h4>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      {health.cpuUsage?.toFixed(2) || 0}%
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2">
                      <MemoryStick className="w-5 h-5 text-purple-500" />
                      <h4 className="text-sm font-medium text-gray-700">Memory Usage</h4>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      {health.memoryUsage?.toFixed(2) || 0}%
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h4 className="text-sm font-medium text-gray-700">Storage Status</h4>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      {health.storageStatus || 'Unknown'}
                    </p>
                  </motion.div>
                  <motion.div
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <h4 className="text-sm font-medium text-gray-700">System Uptime</h4>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                      99.95%
                    </p>
                  </motion.div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-indigo-600" /> System Status
                </h3>
                <div className="mt-3 space-y-2">
                  {getStatusMessages().map((msg, index) => (
                    <p key={index} className={`text-sm font-medium ${msg.color} flex items-center gap-2`}>
                      {msg.text.includes('✅') ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      {msg.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCards;