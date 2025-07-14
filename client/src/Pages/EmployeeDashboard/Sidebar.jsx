import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  FileSearch,
  CloudCog,
  Scale,
  Settings2,
 
  LogOut
} from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const Sidebar = ({ activePage, setActivePage }) => {
  const links = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "POS Monitor", icon: BarChart3 },
    { name: "Event Logs", icon: FileSearch },
    { name: "Phishing Simulation", icon: ShieldAlert },
    { name: "Vendor Logs", icon: FileSearch },
    // { name: "Cloud Audit", icon: CloudCog },
    { name: "Compliance Score", icon: Scale },
    // { name: "Admin Panel", icon: Settings2 }, // Enable if needed
  ];

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
  // Clear user session
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Optional: toast confirmation
  toast.success("Logged out successfully!");

  // Redirect to login
  navigate('/');
}
  return (
    <div
      className={`bg-[#252525] text-white shadow-xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } h-[calc(100vh-2rem)] my-4 ml-4 rounded-xl flex flex-col justify-between`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              RetailShield
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 p-2">
          {links.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActivePage(name.toLowerCase())}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                activePage === name.toLowerCase()
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-md"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col pl-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:bg-white/10 transition"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <div className="text-center text-xs text-gray-400 mt-2">
            © 2025 Retail Shield
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
