import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import logo from '../../../assets/logo.png';

const securityQuestion = () => {
    const navigate = useNavigate();
const { state } = useLocation();
const email = state?.email;
const question = state?.question;

const [answer, setAnswer] = useState('');
const [loading, setLoading] = useState(false);

const handleVerify = async (e) => {
e.preventDefault();
if (!answer) return toast.error('⚠️ Please answer the security question');

javascript
Copy
Edit
try {
  setLoading(true);
  const { data } = await axios.post('http://localhost:3000/api/auth/verify-security-question', {
    email,
    answer,
  });

  toast.success('✅ Verified successfully!');
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  setTimeout(() => navigate('/employee-dashboard'), 1000);
} catch (err) {
  toast.error(err?.response?.data?.message || '❌ Verification failed');
} finally {
  setLoading(false);
}
};
  return (
   <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative">
<Toaster position="top-right" toastOptions={{ style: { background: "#1f1f1f", color: "#00eaff" } }} />


  {/* Logo */}
  <img src={logo} alt="Retail Shield Logo" className="absolute top-4 left-4 w-28 h-auto" />

  <div className="bg-[#111] p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
    <h2 className="text-3xl font-bold mb-4 text-center text-white tracking-wide">Security Check</h2>
    <p className="text-sm text-gray-400 mb-6 text-center">
      Suspicious login detected. Please verify your identity.
    </p>

    <form onSubmit={handleVerify} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Security Question</label>
        <div className="bg-[#1f1f1f] p-3 rounded text-sm text-gray-100 border border-gray-700">
          {question || "What is your security question?"}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-300">Your Answer</label>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer"
          className="w-full px-4 py-2 rounded-lg bg-[#1f1f1f] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition
          ${loading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90'}`}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  </div>
</div>
  )
}

export default securityQuestion