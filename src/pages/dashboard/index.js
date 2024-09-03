import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { NumberBox } from "../../components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  // Mock data - replace with real data from your backend
  const totalUsers = 1250;
  const dailyActiveUsers = 750;
  const revenue = 15000;
  const revenueChange = 2500;

  useEffect(() => {
    document.title = "Dashboard";
  },[]);

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Monthly Active Users",
        data: [650, 590, 800, 810, 560, 550, 750],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NumberBox title="Total Users" value={totalUsers} icon="👥" />
        <NumberBox
          title="Daily Active Users"
          value={dailyActiveUsers}
          icon="🏃"
        />
        <NumberBox
          title="Revenue"
          value={revenue}
          icon="💰"
          change={revenueChange}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Monthly Active Users
        </h2>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default Dashboard;
