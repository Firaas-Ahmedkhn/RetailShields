import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otpStrategy, setOtpStrategy] = useState('');
  const navigate = useNavigate();

  // 🔁 Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post('http://localhost:3000/api/auth/request-otp', { email });

      toast.success('📧 OTP sent to your email!');
      setOtpStrategy(res.data.otpTransformation); // ⬅️ Store the transformation strategy
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP');
      console.error(err);
    }
    setLoading(false);
  };

  // ✅ Step 2: Reset password (user applies transformation manually)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      await axios.post('http://localhost:3000/api/auth/reset-password', {
        email,
        otp,          // ⬅️ transformed OTP entered by user
        newPassword,
      });

      toast.success('✅ Password reset successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label className="block text-sm mb-2">Enter your email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mb-4 rounded border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Sending OTP</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label className="block text-sm mb-2">Enter OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 mb-4 rounded border"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Apply your chosen transformation"
              required
            />

            <label className="block text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mb-4 rounded border"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
            />

            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Transformation Hint:</strong> You selected a strategy during registration.</p>
              <p>Apply that rule to the OTP sent to your email before entering it here.</p>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
