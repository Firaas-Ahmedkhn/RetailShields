import axios from "axios";
import { useState } from "react";
import { Send } from "lucide-react";

const VendorLogForm = () => {
  const [vendorName, setVendorName] = useState("");
  const [action, setAction] = useState("");

  const submitLog = async () => {
    try {
      await axios.post("http://localhost:3000/api/vendor/log", {
        vendorName,
        action,
        ipAddress: window.location.hostname,
      });
      alert("✅ Vendor log submitted successfully!");
      setVendorName("");
      setAction("");
    } catch (err) {
      console.error("Error logging vendor activity:", err);
      alert("❌ Failed to submit vendor log");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT SECTION — Info */}
      <div className="w-full md:w-1/2 bg-white text-black flex flex-col justify-center items-start px-10 py-16">
        <h1 className="text-4xl font-bold mb-4"> Vendor Activity Logger</h1>
        <p className="text-lg leading-relaxed text-gray-700">
          The Vendor Activity Logger allows you to track and log critical vendor-related actions like logins, data access, file uploads, and configuration changes in your system.
        </p>
      </div>

      {/* RIGHT SECTION — Form */}
      <div className="w-full md:w-1/2 bg-gray-800 text-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20  p-8 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center bg-white bg-clip-text text-transparent">
            Submit Vendor Log
          </h2>

          {/* Vendor Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Vendor Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. AWS_Integration"
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Action Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Action</option>
              <option value="login">Login</option>
              <option value="file_upload">File Upload</option>
              <option value="data_access">Data Access</option>
              <option value="failed_login">Failed Login</option>
              <option value="configuration_change">Configuration Change</option>
              <option value="logout">Logout</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={submitLog}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white font-semibold hover:brightness-110 flex items-center justify-center gap-2 transition"
          >
            <Send size={18} /> Submit Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorLogForm;
