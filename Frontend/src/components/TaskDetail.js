import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneTasks } from "../api";
import Cookies from "js-cookie";
import Comments from "./Comments"; // Import the Comments component

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
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!task) {
    return <p className="text-center text-gray-500">No task found</p>;
  }

  return (
    <div className="p-6 h-full mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row gap-8">
      <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <button
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded mb-6 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{task.title}</h2>
        <div className="space-y-4">
          <p className="text-gray-800 text-lg">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Status:</strong> {task.status}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Priority:</strong> {task.priority}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Assigned To:</strong>{" "}
            {task.assignedTo ? task.assignedTo : "Unassigned"}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Created At:</strong>{" "}
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-800 text-lg">
            <strong>Updated At:</strong>{" "}
            {new Date(task.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Comments</h3>
        <Comments taskId={taskId} />
      </div>
    </div>
  );
}

export default TaskDetail;
