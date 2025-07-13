import React, { useState } from 'react';

const PhishingSimulation = () => {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      // simulate AI analysis call — replace with real API
      const response = await fetch("http://localhost:8000/analyze/phishing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emailText }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white rounded rounded-lg  text-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600  bg-clip-text text-transparent">
          Phishing Simulation
        </h1>
        <p className="text-gray-600 mt-1 text-sm">Simulate a phishing attempt and check its threat level using AI.</p>
      </div>

      {/* Input Box */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
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

        {result && (
          <div className="mt-6 bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-semibold mb-2 text-lg text-red-300">AI Result:</h3>
            <p className="text-sm">Phishing Score: <span className="font-bold text-white">{result.score}</span></p>
            <p className="text-sm mt-1">Risk Label: <span className="font-bold text-white">{result.label}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingSimulation;
