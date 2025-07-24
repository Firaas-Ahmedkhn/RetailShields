import {
  LayoutDashboard,
  BarChart3,
  ShieldAlert,
  FileSearch,
  Scale,
  LogOut,
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
    { name: "Phishing Simulation (Beta)", icon: ShieldAlert },
    { name: "Vendor Logs", icon: FileSearch },
    { name: "Compliance Score", icon: Scale },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully!");
    navigate('/');
  };

  return (
    <div
      className={`bg-white text-[#111827] transition-all duration-300 position-fixed rounded-xl h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4  border-gray-200">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-gray-800">
              RetailShield
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1 p-2">
          {links.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActivePage(name.toLowerCase())}
              className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition ${
                activePage === name.toLowerCase()
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{name}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col pl-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
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
