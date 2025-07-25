import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

import MainDash from "./Components/AdminMainDash";
import ManageUsers from "./Components/ManageUsers";
import Reports from "./Components/ReportsAdmin";
import Settings from "./Components/SettingsAdmin";
import ComplianceScore from "./Components/ReportsAdmin";
import PhishingSimulation from "./Components/ReportsAdmin";
import VendorLogs from "../EmployeeDashboard/Components/VendorLogs"
import CloudAudit from "./Components/ReportsAdmin";
import EventLogs from "../EmployeeDashboard/Components/EventLogs";
import NotificationList from "./Components/NotificationList";
import NotificationDetails from "./Components/Notifications";

import { markAsRead, fetchUnreadCount } from "../../Api/Notifications"; // ✅ updated
// ^ Make sure this file contains fetchUnreadCount

const AdminDashboardLayout = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedNotifId, setSelectedNotifId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnread = async () => {
      const count = await fetchUnreadCount(); // ✅ cleaner
      setUnreadCount(count || 0);
    };
    loadUnread();
  }, [activePage]);

  const handleNotificationClick = async (notifId) => {
    try {
      await markAsRead(notifId);
      setSelectedNotifId(notifId);
      setActivePage("notification-details");

      const count = await fetchUnreadCount(); // ✅ update count after read
      setUnreadCount(count || 0);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <MainDash />;
      case "manage users":
        return <ManageUsers />;
      case "notifications":
        return (
          <NotificationList
            setActivePage={setActivePage}
            setSelectedNotifId={setSelectedNotifId}
            onNotificationClick={handleNotificationClick}
          />
        );
      case "notification-details":
        return <NotificationDetails notifId={selectedNotifId} />;
      case "logs & events":
        return <EventLogs />;
      case "phishing simulation":
        return <PhishingSimulation />;
      case "vendor logs":
        return <VendorLogs />;
      case "cloud audit":
        return <CloudAudit />;
      case "compliance score":
        return <ComplianceScore />;
      case "settings":
        return <Settings />;
      case "reports":
        return <Reports />;
      default:
        return <MainDash />;
    }
  };

  return (
    <div className="flex bg-[#f9fafb] min-h-screen">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
      />
      <div className="flex-1 p-4">{renderPage()}</div>
    </div>
  );
};

export default AdminDashboardLayout;
