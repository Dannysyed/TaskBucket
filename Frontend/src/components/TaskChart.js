import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { fetchTasks } from "../api";
import Cookies from "js-cookie";
import Sidebar from "./Sidebar";

// Register the components you need from Chart.js
Chart.register(...registerables);

const TaskChart = () => {
  const [tasks, setTasks] = useState([]);
  const token = Cookies.get("token");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    getTasks();
  }, [token]);

  // Group tasks by status, priority, and date
  const groupedTasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = acc[task.status] ? acc[task.status] + 1 : 1;
    return acc;
  }, {});

  const groupedTasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = acc[task.priority] ? acc[task.priority] + 1 : 1;
    return acc;
  }, {});

  const tasksOverTime = tasks.reduce((acc, task) => {
    const date = new Date(task.createdAt).toLocaleDateString();
    acc[date] = acc[date] ? acc[date] + 1 : 1;
    return acc;
  }, {});

  const tasksByDepartment = tasks.reduce((acc, task) => {
    acc[task.assignedTo] = acc[task.assignedTo] ? acc[task.assignedTo] + 1 : 1;
    return acc;
  }, {});

  // Prepare data for the charts
  const barChartData = {
    labels: Object.keys(groupedTasksByStatus),
    datasets: [
      {
        label: "Number of Tasks by Status",
        data: Object.values(groupedTasksByStatus),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.9)",
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(groupedTasksByPriority),
    datasets: [
      {
        label: "Tasks by Priority",
        data: Object.values(groupedTasksByPriority),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 0.9)",
          "rgba(54, 162, 235, 0.9)",
          "rgba(255, 206, 86, 0.9)",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(tasksOverTime),
    datasets: [
      {
        label: "Tasks Over Time",
        data: Object.values(tasksOverTime),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const doughnutChartData = {
    labels: Object.keys(tasksByDepartment),
    datasets: [
      {
        label: "Tasks by Department",
        data: Object.values(tasksByDepartment),
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 205, 86, 0.7)",
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(255, 159, 64, 0.9)",
          "rgba(153, 102, 255, 0.9)",
          "rgba(75, 192, 192, 0.9)",
          "rgba(255, 205, 86, 0.9)",
        ],
      },
    ],
  };

  const radarChartData = {
    labels: Object.keys(groupedTasksByStatus),
    datasets: [
      {
        label: "Task Distribution by Status",
        data: Object.values(groupedTasksByStatus),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        pointBackgroundColor: "rgba(153, 102, 255, 1)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          boxWidth: 15,
          color: "#333",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        bodyColor: "#fff",
        titleColor: "#fff",
        borderColor: "rgba(0, 0, 0, 0.8)",
        borderWidth: 1,
        padding: 10,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 space-y-8">
        <h3 className="text-3xl font-bold mb-6 text-center md:text-left">
          Tasks Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h4 className="text-xl font-semibold mb-4 text-center">
              Tasks by Status
            </h4>
            <div className="flex-1">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h4 className="text-xl font-semibold mb-4 text-center">
              Tasks by Priority
            </h4>
            <div className="flex-1">
              <Pie
                data={pieChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h4 className="text-xl font-semibold mb-4 text-center">
              Tasks Over Time
            </h4>
            <div className="flex-1">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h4 className="text-xl font-semibold mb-4 text-center">
              Tasks by Department
            </h4>
            <div className="flex-1">
              <Doughnut
                data={doughnutChartData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
            <h4 className="text-xl font-semibold mb-4 text-center">
              Task Distribution by Status
            </h4>
            <div className="flex-1">
              <Radar data={radarChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskChart;
