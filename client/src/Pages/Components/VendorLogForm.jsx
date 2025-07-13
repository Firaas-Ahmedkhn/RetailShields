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
        ipAddress: window.location.hostname, // placeholder
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
    <div className="max-w-md mx-auto p-6 mt-10 bg-black backdrop-blur-md border border-white/20 shadow-xl rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Vendor Activity Logger
      </h2>

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

      <div className="mb-4">
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

      <button
        onClick={submitLog}
        className="w-full mt-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 hover:brightness-110 transition flex items-center justify-center gap-2 font-semibold"
      >
        <Send size={16} /> Submit Log
      </button>
    </div>
  );
};

export default VendorLogForm;
