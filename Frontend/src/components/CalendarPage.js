import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { fetchTasksByDate } from "../api"; // Replace with your API function
import Cookies from "js-cookie";
import Sidebar from "./Sidebar"; // Import Sidebar component

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const getTasksForDate = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const selectedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        const data = await fetchTasksByDate(token, selectedDate);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTasksForDate();
  }, [date, token]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const getTileClassName = ({ date }) => {
    const selectedDate = date.toISOString().split('T')[0];
    const hasTasks = tasks.some(task => new Date(task.dueDate).toISOString().split('T')[0] === selectedDate);
    return hasTasks ? 'bg-yellow-200' : '';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Calendar</h2>
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="flex-1 max-w-3xl mx-auto p-4 rounded-lg shadow-md border border-gray-200">
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar w-full rounded-lg shadow-sm"
              tileClassName={getTileClassName}
            />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Tasks for {date.toDateString()}
            </h3>
            {loading ? (
              <p className="text-center text-gray-500">Loading tasks...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks for this day</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition duration-300"
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {task.title}
                    </h4>
                    <p className="text-gray-700 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-500">
                      Due Date: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CalendarPage;
