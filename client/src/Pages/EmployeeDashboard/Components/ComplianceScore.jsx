import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Key, AlertCircle, Info } from "lucide-react";
import Compliancescorebar from "./Compliancescorebar";

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-400 border-green-400";
  if (score >= 50) return "text-yellow-400 border-yellow-400";
  return "text-red-500 border-red-500";
};

const ComplianceScore = () => {
  const [user, setUser] = useState(null);
  const [isTipsHovered, setIsTipsHovered] = useState(false);
  const cardRef = useRef(null);
  const scoreRef = useRef(null);
  const breakdownRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      axios
        .get(`http://localhost:3000/api/auth/users/${stored.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Fetch error:", err.message));
    }
  }, []);

  if (!user) return <div className="text-gray-500 p-6">Loading...</div>;

  const { complianceScore = 0, passwordStrength, agreementChecked, riskScore } = user;

  const cardVariants = {
    hover: {
      scale: 1.05,
      y: -4,
      boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  const scoreVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const itemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const iconVariants = {
    hover: { scale: 1.2, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const suggestions = [
    {
      text: "Use a strong password with symbols, numbers, and uppercase letters.",
      icon: Key,
    },
    {
      text: "Ensure you accept the agreement checkbox every login.",
      icon: CheckCircle,
    },
    {
      text: "Maintain a consistent typing pattern for biometric trust.",
      icon: Shield,
    },
    {
      text: "Login from your registered IP or trusted device regularly.",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="w-full p-4 bg-[#f9fafb] h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
        Compliance Score
      </h1>
      <div className="relative flex flex-col flex-1">
        {/* Compliance Score Section */}
        <div
         className=" rounded-2xl   p-8 flex-1 mb-[3.75rem]"
          style={{
            maxHeight: "calc(100vh - 2rem - 2.5rem - 1rem)",
          
            
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Shield className="w-7 h-7 text-indigo-600" /> Compliance Score Dashboard
            </h2>
            <motion.span
              className="text-indigo-600 cursor-pointer relative"
              onMouseEnter={() => setIsTipsHovered(true)}
              onMouseLeave={() => setIsTipsHovered(false)}
              variants={iconVariants}
              whileHover="hover"
            >
              <Info className="w-5 h-5" />
              {isTipsHovered && (
                <motion.div
                  className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-lg p-4 shadow-lg z-50 w-80"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.p
                        key={index}
                        className="text-sm font-medium text-gray-600 flex items-center gap-2"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: index * 0.1 }}
                      >
                        <suggestion.icon className="w-4 h-4 text-indigo-600" />
                        {suggestion.text}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.span>
          </div>

          <div ref={cardRef} className="flex flex-col gap-6 w-full h-[calc(100% - 3rem)]">
            {/* Score Circle and Progress Bar */}
            <div className="flex flex-col lg:flex-row gap-6">
              <motion.div
                ref={scoreRef}
                className="flex flex-col items-center justify-center lg:w-1/3"
                variants={scoreVariants}
                initial="initial"
                animate="animate"
              >
                <p className="text-gray-600 mb-3 text-base font-medium">Your Current Compliance Score</p>
                <div
                  className={`relative w-36 h-36 flex items-center justify-center rounded-full border-8 ${getScoreColor(
                    complianceScore
                  )} bg-gradient-to-br from-white to-gray-100`}
                >
                  <span className="text-4xl font-extrabold">{complianceScore}%</span>
                </div>
              </motion.div>
              <div className="lg:w-2/3">
                <Compliancescorebar user={user} />
              </div>
            </div>

            {/* Breakdown Section */}
            <div ref={breakdownRef} className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                 Compliance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-md"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-500" />
                    <h4 className="text-sm font-medium text-gray-700">Password Strength</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-gray-800 capitalize">{passwordStrength}</p>
                </motion.div>
                <motion.div
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-md"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="text-sm font-medium text-gray-700">Agreement Accepted</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-gray-800">{agreementChecked ? "Yes" : "No"}</p>
                </motion.div>
                <motion.div
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-md"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    <h4 className="text-sm font-medium text-gray-700">Biometric Risk Score</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-gray-800">{riskScore}</p>
                </motion.div>
                <motion.div
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-md"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <h4 className="text-sm font-medium text-gray-700">Secure Login</h4>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-gray-800">Active</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceScore;
