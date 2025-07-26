import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import logo from '../../../assets/logo.png';
import { FaQuestionCircle, FaRegKeyboard } from 'react-icons/fa';

const SecurityQuestion = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const question = state?.question;

  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!answer) return toast.error('⚠️ Please answer the security question');

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/auth/verify-security-question', {
        email,
        answer,
      });

      toast.success('✅ Verified successfully!');
      const user = res.data.user;
      const role = user?.role || 'employee';
      const id = user?.id;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));

      setTimeout(() => {
        if (role === 'admin') navigate('/admin-dashboard');
        else navigate(`/employee-dashboard/${id}`);
      }, 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || '❌ Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 relative">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1f1f1f", color: "#00eaff" } }} />

      <img src={logo} alt="Retail Shield Logo" className="absolute top-4 left-4 w-28 h-auto" />

      {/* Left Info */}
      <div className="md:w-1/2 flex flex-col justify-center items-start p-12 bg-white">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Security Verification</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          We’ve detected a suspicious login attempt on your account.
          To ensure your safety, please verify your identity by answering your security question.
        </p>
        <p className="text-gray-500 mt-4 text-sm italic">
          This step helps protect your account from unauthorized access.
        </p>
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-800 px-6 py-12">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 text-white">
          <h2 className="text-3xl font-extrabold text-center mb-6">Answer Security Question</h2>

          <label className="block mb-1 text-sm text-gray-300 flex items-center gap-2">
            <FaQuestionCircle /> Security Question
          </label>
          <div className="w-full mb-4 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 text-sm">
            {question || "What is your favourite color?"}
          </div>

          <label className="block mb-1 text-sm text-gray-300 flex items-center gap-2">
            <FaRegKeyboard /> Your Answer
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer"
            className="w-full mb-6 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full py-3 font-bold rounded-lg transition-all ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105'
            }`}
          >
            {loading ? 'Verifying...' : '🔒 Verify Identity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestion;
