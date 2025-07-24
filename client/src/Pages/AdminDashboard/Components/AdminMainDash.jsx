import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminDashCards from './AdminDashCards';
import ThreatsOverTimeChart from './ThreatoverTimeChart';
import ThreatTypeDonutChart from './DonutChart';

const Dashboard = () => {
  const [threatsOverTime, setThreatsOverTime] = useState([]);
  const [activityDistribution, setActivityDistribution] = useState([]);

  useEffect(() => {
    const fetchThreatStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/stats');
        setThreatsOverTime(res.data.threatsOverTime || []);
      } catch (err) {
        console.error('Error fetching threat stats:', err);
      }
    };

    const fetchActivityStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/stats/actstats');
        setActivityDistribution(res.data || []);
      } catch (err) {
        console.error('Error fetching activity distribution:', err);
      }
    };

    fetchThreatStats();
    fetchActivityStats();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h2>
      </div>

      <AdminDashCards />

      {/* Chart section */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mt-6">
        {/* Threats Over Time */}
       
          <ThreatsOverTimeChart data={threatsOverTime} />
        

        {/* Donut Chart */}
       
          <ThreatTypeDonutChart data={activityDistribution} />
        
      </div>
    </div>
  );
};

export default Dashboard;
