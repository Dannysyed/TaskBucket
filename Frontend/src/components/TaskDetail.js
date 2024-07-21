import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOneTasks, fetchTasks } from "../api";
import Cookies from "js-cookie";

function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(taskId, "////");
  const token = Cookies.get("token");

  useEffect(() => {
    const getTaskDetail = async () => {
      try {
        const data = await fetchOneTasks(token, taskId);

        setTask(data);
        console.log(data, "////asa");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTaskDetail();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!task) {
    return <p>No task found</p>;
  }

  return (
    <div className="p-4">
      <button
        className="bg-gray-300 text-black py-2 px-4 rounded mb-4"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h2 className="text-2xl mb-4">{task.title}</h2>
      <p className="mb-2">
        <strong>Description:</strong> {task.description}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {task.status}
      </p>
      <p className="mb-2">
        <strong>Priority:</strong> {task.priority}
      </p>
      <p className="mb-2">
        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Assigned To:</strong>{" "}
        {task.assignedTo ? task.assignedTo : "Unassigned"}
      </p>
      <p className="mb-2">
        <strong>Created At:</strong>{" "}
        {new Date(task.createdAt).toLocaleDateString()}
      </p>
      <p className="mb-2">
        <strong>Updated At:</strong>{" "}
        {new Date(task.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default TaskDetail;
