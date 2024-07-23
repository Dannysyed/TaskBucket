import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { fetchTasks } from "../api"; // Replace with your API function
import Cookies from "js-cookie";
import Sidebar from "./Sidebar"; // Import Sidebar component
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [taskDates, setTaskDates] = useState(new Set()); // State to track dates with tasks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const token = Cookies.get("token");

  let navigate = useNavigate();
  useEffect(() => {
    const getTasks = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const data = await fetchTasks(token);
        setTasks(data);

        // Create a set of dates that have tasks
        const datesWithTasks = new Set(
          data.map((task) => new Date(task.dueDate).toISOString().split("T")[0])
        );
        setTaskDates(datesWithTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [token]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const getTileClassName = ({ date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    const isToday = date.toDateString() === new Date().toDateString();
    return `
      ${
        taskDates.has(formattedDate)
          ? "bg-yellow-300 border-2 border-yellow-500"
          : ""
      }
      ${isToday ? "border-4 border-blue-600 rounded-lg" : ""}
      rounded-lg hover:bg-yellow-100
    `;
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task}`);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const taskStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-red-800 bg-red-100 rounded-full">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-6 bg-gradient-to-br from-gray-200 to-gray-300 overflow-y-auto">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6">
          Calendar
        </h2>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center">
          <div className="flex-1 max-w-full lg:max-w-3xl mx-auto p-4 lg:p-6 rounded-lg shadow-xl border border-gray-300 bg-white">
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar w-full rounded-lg shadow-md"
              tileClassName={getTileClassName}
              nextLabel={<span className="text-gray-600">→</span>}
              prevLabel={<span className="text-gray-600">←</span>}
              next2Label={null}
              prev2Label={null}
            />
          </div>
          <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-xl border border-gray-300 overflow-y-auto custom-scrollbar">
            <h3 className="text-xl lg:text-3xl font-semibold text-gray-900 mb-4 lg:mb-6">
              Tasks for {date.toDateString()}
            </h3>
            {loading ? (
              <div className="flex items-center justify-center text-gray-500">
                <AiOutlineLoading3Quarters className="animate-spin mr-2 text-xl lg:text-2xl" />
                Loading tasks...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center text-red-500">
                <BiErrorCircle className="mr-2 text-xl lg:text-2xl" />
                Error: {error}
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks for this day</p>
            ) : (
              <ul className="space-y-4 lg:space-y-6">
                {tasks
                  .filter(
                    (task) =>
                      new Date(task.dueDate).toISOString().split("T")[0] ===
                      date.toISOString().split("T")[0]
                  )
                  .map((task) => (
                    <li
                      key={task._id}
                      className={`p-4 lg:p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-300 cursor-pointer ${
                        task.status === "completed"
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                      onClick={() => handleTaskClick(task._id)}
                    >
                      <h4 className="text-lg lg:text-2xl font-semibold text-gray-800 mb-2">
                        {task.title}
                      </h4>
                      <p className="text-gray-700 mb-2">{task.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-500">
                          Due Date:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                        {taskStatusBadge(task.status)}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-xl w-11/12 max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <MdClose size={24} />
            </button>
            <h4 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
              {selectedTask.title}
            </h4>
            <p className="text-gray-700 mb-4">{selectedTask.description}</p>
            <p className="text-sm text-gray-500">
              Due Date: {new Date(selectedTask.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Status: {taskStatusBadge(selectedTask.status)}
            </p>
            {/* Add buttons for task actions */}
            <div className="mt-4 flex flex-col lg:flex-row justify-end gap-3">
              <button className="px-4 lg:px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
                Edit
              </button>
              <button className="px-4 lg:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
