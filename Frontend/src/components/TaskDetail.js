import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneTasks } from "../api";
import Cookies from "js-cookie";
import Comments from "./Comments"; // Import the Comments component
import { FaArrowLeft } from "react-icons/fa"; // Icon for the back button

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const getTaskDetail = async () => {
      try {
        const data = await fetchOneTasks(token, taskId);
        setTask(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTaskDetail();
  }, [taskId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* Replace with your spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-6">
        <p className="text-xl">Error: {error}</p>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center text-gray-600 mt-6">
        <p className="text-xl">No task found</p>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <button
          className="flex items-center text-blue-600 hover:text-blue-800 text-lg mb-6 focus:outline-none"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">{task.title}</h2>
        <div className="space-y-6">
          <DetailItem label="Description" value={task.description} />
          <DetailItem
            label="Status"
            value={task.status}
            className={getStatusClass(task.status)}
          />
          <DetailItem
            label="Priority"
            value={task.priority}
            className={getPriorityClass(task.priority)}
          />
          <DetailItem
            label="Due Date"
            value={new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          />
          <DetailItem
            label="Assigned To"
            value={task.assignedTo ? task.assignedTo.name : "Unassigned"}
          />
          <DetailItem
            label="Created At"
            value={new Date(task.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          />
          <DetailItem
            label="Updated At"
            value={new Date(task.updatedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          />
        </div>
      </div>
      <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-3xl font-semibold text-gray-900 mb-6">Comments</h3>
        <Comments taskId={taskId} />
      </div>
    </div>
  );
}

const DetailItem = ({ label, value, className }) => (
  <div className="flex items-center mb-4">
    <p className="text-gray-800 text-xl font-medium mr-4">{label}:</p>
    <p className={`text-gray-600 text-lg ${className}`}>{value}</p>
  </div>
);

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-600";
    case "In Progress":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-red-100 text-red-600";
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-600";
    case "Medium":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "bg-green-100 text-green-600";
  }
};

export default TaskDetail;
