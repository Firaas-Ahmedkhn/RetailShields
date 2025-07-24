import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PosRiskDonutChart = () => {
  const [riskData, setRiskData] = useState({
    labels: [],
    datasets: [
      {
        label: "POS Risk Levels",
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pos/stats");
        const labels = [];
        const data = [];
        const colorMap = {
          High: "#FF4C4C",   // red
          Medium: "#FFBB28", // yellow
          Low: "#00C49F",    // green
        };
        const backgroundColor = [];

        res.data.forEach((item) => {
          const label = item._id.charAt(0).toUpperCase() + item._id.slice(1);
          labels.push(label);
          data.push(item.count);
          backgroundColor.push(colorMap[label] || "#cccccc"); // fallback gray
        });

        setRiskData({
          labels,
          datasets: [
            {
              label: "POS Risk Levels",
              data,
              backgroundColor,
              borderColor: "#ffffff",
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch POS stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md w-full max-w-[530px] p-6 flex flex-col items-center justify-center min-h-[320px]">
      <div className="w-full h-[250px] flex justify-center items-center">
        <Doughnut
          data={riskData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "#333",
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return `${tooltipItem.label}: ${tooltipItem.raw}`;
                  },
                },
              },
            },
            cutout: "65%",
          }}
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-black text-center">
        POS Risk Distribution
      </h3>
    </div>
  );
};

export default PosRiskDonutChart;
