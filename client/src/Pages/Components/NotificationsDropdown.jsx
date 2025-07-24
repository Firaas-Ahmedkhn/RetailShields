import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { fetchNotifications, markAsRead } from '../../Api/Notifications';
import { useNavigate } from 'react-router-dom';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const data = await fetchNotifications(); // Replace with your actual API call
    setNotifications(data || []);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleNotificationClick = async (id) => {
    await markAsRead(id); // Optional: update backend
    navigate(`/notifications/${id}`);
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="relative">
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
          <div className="p-2 text-sm font-semibold border-b">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 p-4">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    !notif.read ? 'font-medium bg-gray-50' : 'text-gray-600'
                  }`}
                  onClick={() => handleNotificationClick(notif._id)}
                >
                  {notif.title}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
