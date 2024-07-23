import React, { useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  getUsersAll,
} from "../api";
import Modal from "./Modal";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { HiPlusCircle, HiPencilAlt, HiTrash } from "react-icons/hi";
import { animated, useSpring } from "@react-spring/web";
import { debounce } from "lodash";

const TaskForm = ({
  newTask,
  handleChange,
  handleSubmit,
  errors,
  users,
  onClose,
  editMode,
}) => (
  <form onSubmit={handleSubmit} className="space-y-4 p-4">
    <h2 className="text-2xl font-bold mb-4">
      {editMode ? "Edit Task" : "Add New Task"}
    </h2>
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
      <label className="block mb-2 font-semibold">Description</label>
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
        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
        <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
      )}
    </div>
    <div>
      <label className="block mb-2 font-semibold">Assigned To</label>
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
          <option key={user._id} value={user.name}>
            {user.name}
          </option>
        ))}
      </select>
      {errors.assignedTo && (
        <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
      )}
    </div>
    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        {editMode ? "Update Task" : "Add Task"}
      </button>
      <button
        type="button"
        className="ml-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-300"
        onClick={onClose}
      >
        Cancel
      </button>
    </div>
  </form>
);

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
  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
      let data;
      if (editMode) {
        data = await updateTask(token, selectedTask._id, newTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === selectedTask._id ? data : task))
        );
      } else {
        data = await createTask(token, newTask);
        setTasks((prevTasks) => [...prevTasks, data]);
      }
      setNewTask({
        title: "",
        description: "",
        status: "In Progress",
        priority: "High",
        dueDate: "",
        assignedTo: "",
      });
      setIsModalVisible(false);
      setEditMode(false);
      setSelectedTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(token, taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setNewTask(task);
    setIsModalVisible(true);
    setEditMode(true);
    setSelectedTask(task);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );
  
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "search") {
      debouncedSearch(value);
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
    // transform: isModalVisible ? `translateY(220)` : `translateY(-20px)`,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => window.location.reload()}
        >
          Retry
        </button> 
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
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
              <TaskForm
                newTask={newTask}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                users={users}
                onClose={() => setIsModalVisible(false)}
                editMode={editMode}
              />
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
            <option value=""> Statuses</option>
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
            <option value="">Priorities</option>
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
            <option value="">Assignees</option>
            {users.map((user) => (
              <option key={user._id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300 border-t-4 ${
                  task.priority === "High"
                    ? "border-red-500"
                    : task.priority === "Medium"
                    ? "border-yellow-500"
                    : "border-green-500"
                }`}
              >
                <Link
                  to={`/tasks/${task._id}`}
                  className="block text-lg font-semibold text-gray-800"
                >
                  {task.title}
                </Link>
                <p className="text-gray-600 mt-2">{task.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {task.status} | {task.priority} | Due: {task.dueDate}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Assigned to: {task.assignedTo}
                </p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition duration-300"
                    onClick={() => handleEdit(task)}
                  >
                    <HiPencilAlt />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition duration-300"
                    onClick={() => handleDelete(task._id)}
                  >
                    <HiTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-4">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
