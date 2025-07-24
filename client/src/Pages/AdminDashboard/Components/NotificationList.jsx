import React, { useEffect, useState } from "react";
import { fetchNotifications, markAsRead } from "../../../Api/Notifications";
import { formatDistanceToNow } from "date-fns";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const NotificationList = ({ setActivePage, setSelectedNotifId }) => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadNotifications = async (pageNumber = 1) => {
    try {
      const data = await fetchNotifications(pageNumber);
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("Unexpected notification structure:", data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications(page);
  }, [page]);

  const handleClick = async (notif) => {
    try {
      await markAsRead(notif._id);
      setSelectedNotifId(notif._id);
      setActivePage("notification-details");
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const getRiskColor = (risk) => {
    if (!risk) return "bg-gray-100 border-gray-300 text-gray-700";
    switch (risk.toLowerCase()) {
      case "high":
        return "bg-red-100 border-red-400 text-red-700";
      case "medium":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "low":
        return "bg-green-100 border-green-400 text-green-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-700";
    }
  };

  const getRiskIcon = (risk) => {
    if (!risk) return "ℹ️";
    switch (risk.toLowerCase()) {
      case "high":
        return "🚨";
      case "medium":
        return "⚠️";
      case "low":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        All Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="grid gap-3">
          {notifications.map((notif) => {
            const risk = notif?.riskLevel || "unknown";
            const riskStyle = getRiskColor(risk);
            const riskIcon = getRiskIcon(risk);
            const isUnread = !notif.isRead;

            return (
              <div
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`relative transition-all duration-300 cursor-pointer border-l-4 shadow-sm hover:shadow-md rounded-md p-4
                  ${riskStyle}
                  ${isUnread ? "bg-white border-blue-400 ring-2 ring-blue-300 animate-pulse" : ""}`}
              >
                {/* NEW Badge */}
                {isUnread && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    NEW
                  </div>
                )}

                <div className="flex justify-between items-center mb-1">
                  <div className={`text-lg flex items-center gap-2 ${isUnread ? "font-semibold" : "font-medium"}`}>
                    {riskIcon} {notif.title || "Untitled"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {notif.createdAt
                      ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })
                      : "Unknown time"}
                  </div>
                </div>

                <p className="text-gray-700 text-sm">{notif.message || "No message provided."}</p>

                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                    Source: {notif.source || "Unknown"}
                  </span>
                  <span
                    className={`font-semibold uppercase tracking-wide ${
                      risk.toLowerCase() === "high"
                        ? "text-red-700"
                        : risk.toLowerCase() === "medium"
                        ? "text-yellow-700"
                        : risk.toLowerCase() === "low"
                        ? "text-green-700"
                        : "text-gray-700"
                    }`}
                  >
                    Risk: {risk}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
