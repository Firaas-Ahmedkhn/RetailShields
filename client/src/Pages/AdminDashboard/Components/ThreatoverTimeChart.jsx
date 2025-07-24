// src/Pages/AdminDashboard/Components/ThreatsOverTimeChart.jsx
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ThreatsOverTimeChart = ({ data }) => {
  // Transform data for chart.js
  const labels = data.map(item => item._id);
  const counts = data.map(item => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Threats Count',
        data: counts,
        backgroundColor: '#6366f1',
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#d1d5db',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280' },
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280' },
      },
    },
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-white   rounded-2xl shadow-md p-6 flex flex-col items-center justify-center h-[350px]">
        <div className="w-full max-w-[90%] h-[250px]">
          <Bar data={chartData} options={options} />
        </div>
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-black ">
            Threats Detected Over Time
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ThreatsOverTimeChart;
