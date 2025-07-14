import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import SlideshowWithText from './components/Slideshow';
import logo from '../../assets/logo.png';
import {
  initTypingTracker,
  cleanupTypingTracker,
  extractFeatures,
  resetTypingTracker,
} from '../../utils/typingTracker';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [registeredIp, setregisteredIp] = useState('');
  const [otpTransformation, setOtpTransformation] = useState('');
  const passwordRef = useRef();

  useEffect(() => {
    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => setregisteredIp(data.ip))
      .catch((err) => console.error("Failed to fetch IP:", err));

    initTypingTracker(passwordRef);
    return () => cleanupTypingTracker(passwordRef);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) return toast.error("❌ Passwords do not match");
    if (!otpTransformation) return toast.error("🔒 Please select OTP transformation");

    const biometricProfile = extractFeatures(password);
    if (biometricProfile.length === 0)
      return toast.error("⚠️ Typing pattern not captured properly. Try again.");

    try {
      console.log("📍 IP being sent:", registeredIp);

      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password,
        role: 'employee',
        biometricProfile,
        otpTransformation,
        registeredIp, // ✅ You’ve defined and fetched this properly
      });

      console.log("📡 Backend response:", response.data);

      toast.success("✅ Registered successfully!");
      resetTypingTracker();
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      console.error("❌ Registration Error:", err);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row ">
      <img src={logo} alt="Retail Shield Logo" className="absolute top-4 left-4 w-32 h-auto z-50" />
      <Toaster position="top-right" toastOptions={{ style: { background: "#333", color: "#fff" } }} />

      {/* LEFT: Registration Form */}
      <div className="w-full lg:w-1/2 bg-white px-6 py-12 flex gap-5 items-center justify-center text-black">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-semibold text-center mb-4">Create Your Account</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Join Retail CyberSecure to monitor & protect your retail infrastructure.
          </p>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Name + Email */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 mb-4">
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex-1 mb-4">
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password + Confirm Password */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 mb-4">
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  ref={passwordRef}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Create a strong password"
                />
              </div>

              <div className="flex-1 mb-4">
                <label className="block text-sm mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* OTP Transformation */}
            <div className="mb-4">
              <label className="block text-sm mb-1 ">Select OTP Transformation Strategy</label>
              <select
                value={otpTransformation}
                onChange={(e) => setOtpTransformation(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option  className ="text-gray-400 bg-gray-400" value="">-- Select a strategy --</option>
                <option value="reverse">Reverse OTP</option>
                <option value="prefix_42">Prefix 42</option>
                <option value="shift_+1">Shift digits +1</option>
                <option value="shift_-1">Shift digits -1</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                You'll have to apply this transformation to your OTP during password reset.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!registeredIp || !name || !email || !password || !confirm || !otpTransformation}
              className={`w-full py-2 rounded-lg font-semibold text-white transition
    ${(!registeredIp || !name || !email || !password || !confirm || !otpTransformation)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90'}`}
            >
              {registeredIp ? 'Create Account' : 'Fetching IP...'}
            </button>

          </form>


          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/" className="text-blue-600 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Slideshow */}
      <SlideshowWithText />
    </div>
  );
};

export default Register;
