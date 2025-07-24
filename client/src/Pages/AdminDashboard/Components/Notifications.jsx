import React, { useEffect, useState } from "react";
import { fetchNotificationById } from "../../../Api/Notifications";
import { fetchUserById } from "../../../Api/UserApi";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const NotificationDetails = ({ notifId }) => {
  const [notif, setNotif] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchNotificationById(notifId);
        setNotif(data);

        if (data.userId) {
          const userInfo = await fetchUserById(data.userId);
          setUser(userInfo);
        }
      } catch (error) {
        console.error("Error fetching notification or user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (notifId) fetchData();
  }, [notifId]);

  const riskColor =
    notif?.riskLevel === "high"
      ? "border-red-500 bg-red-50 text-red-800"
      : notif?.riskLevel === "medium"
      ? "border-yellow-500 bg-yellow-50 text-yellow-800"
      : "border-blue-500 bg-blue-50 text-blue-800";

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-2/3"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">{notif.title}</h2>

      <div className={`rounded-lg border shadow p-6 grid md:grid-cols-2 gap-6 ${riskColor}`}>
        {/* Left column: Notification */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Alert Details</h3>
          <p className="mb-2"><strong>Message:</strong> {notif.message}</p>
          <p className="mb-2"><strong>Risk Level:</strong> {notif.riskLevel.toUpperCase()}</p>
          <p className="mb-2"><strong>Source:</strong> {notif.source}</p>
          <p className="mb-2"><strong>Time:</strong> {moment(notif.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</p>
          {/* <p className="mb-2"><strong>Terminal ID:</strong> <span className="text-purple-600 font-semibold">{notif.terminalId || "N/A"}</span></p>
          <p className="mb-2"><strong>Amount:</strong> <span className="text-green-700 font-semibold">₹{notif.relatedData?.amount || "N/A"}</span></p> */}
          <p className="text-sm text-gray-500"><strong>Notification ID:</strong> {notif._id}</p>
        </div>

        {/* Right column: User Info */}
        <div className="bg-white border rounded p-4">
          <h3 className="text-xl font-semibold mb-3">Employee Details</h3>
          {user ? (
            <>
              <p className="mb-2"><strong>Name:</strong> {user.name}</p>
              <p className="mb-2"><strong>Email:</strong> {user.email}</p>
              <p className="mb-2"><strong>User ID:</strong> {user._id}</p>
            </>
          ) : (
            <p className="text-sm text-gray-500">No user data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;
