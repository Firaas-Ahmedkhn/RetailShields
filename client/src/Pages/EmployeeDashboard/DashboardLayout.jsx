import Sidebar from "./Sidebar";    

import Pos from "./Components/Pos";
import PhishingSimulation from "./Components/PhisihingSimulation";
import VendorLogs from "./Components/VendorLogs";
import CloudAudit from "./Components/CloudAudit";
import ComplianceScore from "./Components/ComplianceScore";
import MainDash from "./Components/MainDashboard"
import EventLogs from "./Components/EventLogs";
import { useState } from "react";



const DashboardLayout = () => {
    const [ activePage, setActivePage ] = useState('dashboard');
    const renderPage = () => {
  switch (activePage) {
    case 'dashboard': return <MainDash />;
    case 'pos monitor': return <Pos />;
    case 'event logs':return <EventLogs />;
    case 'phishing simulation (beta)': return <PhishingSimulation />;
    case 'vendor logs': return <VendorLogs />;
    case 'cloud audit': return <CloudAudit />;
    case 'compliance score': return <ComplianceScore />;
    default: return <mainDashboard />;
  }
};

  return (
    <div className="flex bg-white min-h-screen">
      < Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1">{renderPage()}</div>
    </div>
  );
}

export default DashboardLayout