import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchTasks, createTask } from "../api";
import Modal from "./Modal";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

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
    assignedTo: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  // Validation state
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
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

    // Validate each field as it changes
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "title":
        if (value.trim() === "") {
          error = "Title is required";
        } else if (/^\d+$/.test(value)) {
          error = "Title must contain at least one non-numeric character";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Title cannot contain special characters";
        }
        break;
      case "description":
        if (value.trim() === "") {
          error = "Description is required";
        } else if (/^\d+$/.test(value)) {
          error = "Description must contain at least one non-numeric character";
        } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error = "Description cannot contain special characters";
        }
        break;
      case "dueDate":
        error = value.trim() === "" ? "Due Date is required" : "";
        break;
      case "assignedTo":
        error = value.trim() === "" ? "Assigned To is required" : "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const formValid = Object.values(errors).every((error) => error === "");

    if (!formValid) {
      console.log("Form has errors, cannot submit");
      return;
    }

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
        assignedTo: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      setSearchTerm(value);
    } else if (name === "status") {
      setStatusFilter(value);
    } else if (name === "priority") {
      setPriorityFilter(value);
    } else if (name === "assignee") {
      setAssigneeFilter(value);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? task.status === statusFilter : true) &&
      (priorityFilter ? task.priority === priorityFilter : true) &&
      (assigneeFilter ? task.assignedTo === assigneeFilter : true)
    );
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
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
                className={`w-full px-3 py-2 border rounded ${
                  errors.title ? "border-red-500" : ""
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.description ? "border-red-500" : ""
                }`}
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
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
                className={`w-full px-3 py-2 border rounded ${
                  errors.dueDate ? "border-red-500" : ""
                }`}
                required
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block mb-1">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.assignedTo ? "border-red-500" : ""
                }`}
                required
              />
              {errors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
              )}
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
        </div>

        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          />
          <select
            name="status"
            value={statusFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
          <select
            name="priority"
            value={priorityFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="text"
            name="assignee"
            placeholder="Filter by assignee..."
            value={assigneeFilter}
            onChange={handleFilterChange}
            className="px-3 py-2 border rounded"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 border-b text-left">Title</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Priority</th>
                <th className="py-2 px-4 border-b text-left">Due Date</th>
                <th className="py-2 px-4 border-b text-left">Assigned To</th>
                <th className="py-2 px-4 border-b text-left">Created At</th>
                <th className="py-2 px-4 border-b text-left">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4 border-b">
                    <Link to={`/tasks/${task._id}`}>{task.title}</Link>
                  </td>
                  <td className="py-3 px-4 border-b">{task.description}</td>
                  <td className="py-3 px-4 border-b">{task.status}</td>
                  <td className="py-3 px-4 border-b">{task.priority}</td>
                  <td className="py-3 px-4 border-b">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {task.assignedTo ? task.assignedTo : "Unassigned"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
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
