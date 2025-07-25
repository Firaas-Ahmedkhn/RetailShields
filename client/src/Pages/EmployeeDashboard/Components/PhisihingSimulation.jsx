import React, { useState } from "react";
import axios from "axios";

const PhishingSimulation = () => {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await axios.post("http://localhost:3000/api/phishing/analyze", {
        text: emailText,
      });

      if (res.data?.score !== undefined && res.data?.label) {
        setResult(res.data);
      } else {
        setError("❌ AI responded, but with unexpected format. Please try again.");
      }
    } catch (err) {
      console.error("Error from API:", err);
      setError("❌ Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white rounded-lg text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Phishing Simulation (Beta)
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Simulate a phishing attempt and check its threat level using AI.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg w-full  mx-auto">
        <label className="block mb-2 text-sm font-medium text-gray-500">
          Enter suspicious email content:
        </label>
        <textarea
          rows="6"
          className="w-full p-3 rounded-lg bg-white/20 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="e.g. 'Your account is suspended. Click here to verify...'"
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 transition shadow-md"
        >
          Analyze
        </button>

        {loading && (
          <div className="mt-4 text-center text-blue-500 font-medium animate-pulse">
             AI is analyzing... Sit back and relax!
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-500 font-medium">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold mb-2 text-lg text-red-500">AI Result:</h3>
            <p className="text-sm text-blue-400">
              ⚠️ <span className="font-semibold">Phishing Score:</span>{" "}
              <span className="font-bold text-amber-400">{result.score}</span>
            </p>
            <p className="text-sm mt-1 text-blue-400">
              🛡️ <span className="font-semibold">Risk Label:</span>{" "}
              <span className="font-bold text-fuchsia-600">{result.label}</span>
            </p>

            {/* ✅ NEW: AI detailed explanation */}
            {result.explanation && (
              <p className="text-sm mt-3 text-gray-700 bg-gray-100 p-3 rounded">
                🧠 <span className="font-semibold">AI Explanation:</span> {result.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingSimulation;
