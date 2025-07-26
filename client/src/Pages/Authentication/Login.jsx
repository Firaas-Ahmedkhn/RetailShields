import React, { useRef, useState, useEffect } from "react";
import { initTypingTracker, cleanupTypingTracker, extractFeatures } from "../../utils/typingTracker.js";
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loginAnimation from '../../assets/animations/login-loading.json';

import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import SlideshowWithText from './components/Slideshow';
import logo from '../../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    initTypingTracker(passwordRef);
    return () => cleanupTypingTracker(passwordRef);
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!agreed) {
    toast.error("Please agree to the terms before continuing.");
    return;
  }

  setShowAnimation(true);
  setLoading(true);

  const typingPattern = extractFeatures(password);

  if (typingPattern.length === 0) {
    toast.error("⚠️ Typing pattern not captured properly. Try again.");
    setShowAnimation(false);
    setLoading(false);
    return;
  }

  // ⏳ Delay API call by 5 seconds to show Lottie animation
  setTimeout(async () => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
        typingPattern,
        agreementChecked: agreed,
      });

      toast.success("✅ Login successful!");

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const { role, id } = data.user;

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate(`/employee-dashboard/${id}`);
        }
      }, 1000);

    } catch (err) {
      const data = err?.response?.data;

      if (data?.redirectToSecurityQuestion) {
        localStorage.setItem('tempmail', data.email);
        toast.error("⚠️ Suspicious biometric behavior. Please verify.");
        return navigate("/security-question", {
          state: {
            email: data.email,
            question: data.question,
          },
        });
      }

      toast.error(data?.message || "❌ Login failed");
    } finally {
      setShowAnimation(false);
      setLoading(false);
    }
  }, 5000); // ⏱️ 5 second delay
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* ✅ Face scan Lottie on login */}
      {showAnimation && (
        <div className="fixed top-0 left-0 w-full h-32 z-50 flex items-center justify-center bg-white shadow-md">
          <Lottie
            animationData={loginAnimation}
            loop
            autoplay
            style={{ height: '80px', width: '80px' }}
          />
        </div>
      )}

      <img
        src={logo}
        alt="Retail Shield Logo"
        className="absolute top-2 left-2 w-24 h-auto z-50 lg:top-4 lg:left-4 lg:w-32"
      />
      <Toaster position="top-right" toastOptions={{ style: { background: "#333", color: "#fff" } }} />

      <div className="w-full lg:w-1/2 bg-white px-6 py-12 flex items-center justify-center text-black min-h-screen lg:min-h-fit">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center mb-4">Welcome Back!</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Continuing protection with Retail Shield
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="text"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                ref={passwordRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="password"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex flex-row justify-between items-center w-full mt-4">
                <div className="flex items-center mb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    I agree to the&nbsp;
                    <a href="#" className="text-blue-600 hover:underline">
                      terms and conditions
                    </a>
                  </label>
                </div>

                <p className="text-sm text-gray-600">
                  <a href="/forgot-pass" className="text-blue-600 hover:underline">Forgot Password?</a>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!agreed || loading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition
                ${!agreed || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90'}`}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mt-2">
              New to Retail Shield? <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </p>
          </div>
        </div>
      </div>

      <SlideshowWithText />
    </div>
  );
};

export default Login;
