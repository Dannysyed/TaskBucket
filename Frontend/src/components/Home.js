import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchTasks, createTask } from "../api";
import Modal from "./Modal";
import Sidebar from "./Sidebar";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "In Progress",
    priority: "High",
    dueDate: "",
  });
  const token = Cookies.get("token");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks(token);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createTask(token, newTask);
      setTasks((prevTasks) => [...prevTasks, data]);
      setIsModalVisible(false);
      setNewTask({
        title: "",
        description: "",
        status: "In Progress",
        priority: "High",
        dueDate: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const taskCountsByStatus = tasks.reduce(
    (counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    },
    { "In Progress": 0, Completed: 0, "Not Started": 0 }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setIsModalVisible(true)}
          >
            Add Task
          </button>
        </div>

        <Modal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Priority</label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Add Task
            </button>
          </form>
        </Modal>

        <div className="mb-4">
          <h3 className="text-blue-500 mb-2">Dashboard</h3>
          <ul className="list-disc list-inside">
            <li>In Progress: {taskCountsByStatus["In Progress"]}</li>
            <li>Completed: {taskCountsByStatus.Completed}</li>
            <li>Not Started: {taskCountsByStatus["Not Started"]}</li>
          </ul>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Assigned To</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="py-2 px-4 border-b">{task.title}</td>
                  <td className="py-2 px-4 border-b">{task.description}</td>
                  <td className="py-2 px-4 border-b">{task.status}</td>
                  <td className="py-2 px-4 border-b">{task.priority}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {task.assignedTo ? task.assignedTo : "Unassigned"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
