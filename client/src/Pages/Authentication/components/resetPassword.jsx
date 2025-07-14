import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../../../assets/logo.png';
import resetIllustration from '../../../assets/forgot.png'; // make sure you have this image

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        if (!password || !confirm) return toast.error('⚠️ Fill all fields');
        if (password !== confirm) return toast.error('❌ Passwords don’t match');

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/auth/reset-password', {
                email,
                newPassword: password
            });
            toast.success('🎉 Password reset successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-white text-black">
            <Toaster position="top-right" />

            {/* Left image panel */}
            <div className="hidden md:flex w-1/2 bg-[#0f172a] items-center justify-center p-10">
                <img src={resetIllustration} alt="Reset Illustration" className="w-3/4 object-contain" />
            </div>

            {/* Right form section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-10">
                <img src={logo} alt="Retail Shield" className="w-32 mb-8" />
                <h2 className="text-3xl font-bold mb-2">Reset Your Password</h2>
                <p className="text-gray-600 mb-6">Set a strong new password to secure your account.</p>

                <form onSubmit={handleReset} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Confirm Password</label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="Re-enter password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-semibold ${loading
                                ? 'bg-gray-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90'
                            }`}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
