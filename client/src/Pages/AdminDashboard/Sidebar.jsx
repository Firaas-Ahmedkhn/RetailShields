import {
  LayoutDashboard,
  Users2,
  FileSearch,
  ShieldCheck,
  ServerCog,
  Scale,
  BarChart3,
  Settings2,
  LogOut,
  Bell,
} from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AdminSidebar = ({ activePage, setActivePage, unreadCount, setUnreadCount }) => {
  const links = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Manage Users", icon: Users2 },
    { name: "Notifications", icon: Bell },
    { name: "Logs & Events", icon: FileSearch },
    { name: "Vendor Logs", icon: ServerCog },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings2 },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleLinkClick = (name) => {
    if (name.toLowerCase() === "notifications") {
      setUnreadCount(0);
    }
    setActivePage(name.toLowerCase());
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/notifications/unread-count');
        setUnreadCount(res.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnread();
  }, [activePage]);

  return (
    <div
      className={`bg-white text-[#111827] transition-all duration-300 position-fixed  h-[calc(100vh-1rem)] my-2 mt-2 ml-4 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
       <div className="flex items-center justify-between px-4 py-4  border-gray-200">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-gray-800">
              Admin Panel
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
              onClick={() => handleLinkClick(name)}
              className={`relative flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition ${
                activePage === name.toLowerCase()
                  ? "bg-gray-100 text-gray-900"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{name}</span>}

              {name === "Notifications" && unreadCount > 0 && (
                <span className="absolute top-1 left-5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
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

export default AdminSidebar;
