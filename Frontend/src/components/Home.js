import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchTasks, createTask, getUsersAll } from "../api";
import Modal from "./Modal";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { HiPlusCircle } from "react-icons/hi"; // Import an icon for the "Add Task" button
import { animated, useSpring } from "@react-spring/web"; // Import react-spring for animations

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
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getUsersAll(token);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    getUsers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));

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

  const modalAnimation = useSpring({
    opacity: isModalVisible ? 1 : 0,
    transform: isModalVisible ? `translateY(0)` : `translateY(-20px)`,
  });

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <button
            className="flex items-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
            onClick={() => setIsModalVisible(true)}
          >
            <HiPlusCircle className="mr-2" />
            Add Task
          </button>
        </div>

        {isModalVisible && (
          <animated.div style={modalAnimation}>
            <Modal
              isVisible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
            >
              <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                  <label className="block mb-2 font-semibold">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold">Status</label>
                    <select
                      name="status"
                      value={newTask.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded border-gray-300"
                      required
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Not Started">Not Started</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Priority</label>
                    <select
                      name="priority"
                      value={newTask.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded border-gray-300"
                      required
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded ${
                      errors.dueDate ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    value={newTask.assignedTo}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded ${
                      errors.assignedTo ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignedTo}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </Modal>
          </animated.div>
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            name="search"
            value={searchTerm}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded w-full md:w-auto"
          />
          <select
            name="status"
            value={statusFilter}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded w-full md:w-auto"
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
            className="px-4 py-2 border rounded w-full md:w-auto"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            name="assignee"
            value={assigneeFilter}
            onChange={handleFilterChange}
            className="px-4 py-2 border rounded w-full md:w-auto"
          >
            <option value="">All Assignees</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {filteredTasks.length > 0 ? (
            <ul>
              {filteredTasks.map((task) => (
                <li
                  key={task._id}
                  className="px-6 py-4 border-b last:border-none hover:bg-gray-50 transition duration-300"
                >
                  <Link
                    to={`/tasks/${task._id}`}
                    className="block text-lg font-semibold text-gray-800"
                  >
                    {task.title}
                  </Link>
                  <p className="text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    {task.status} | {task.priority} | Due: {task.dueDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignedTo}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
