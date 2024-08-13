import React from "react";

const TaskForm = ({
  newTask,
  handleChange,
  handleSubmit,
  errors,
  users,
  projects,
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
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>
      {errors.assignedTo && (
        <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
      )}
    </div>
    <div>
      <label className="block mb-2 font-semibold">Project</label>
      <select
        name="project"
        value={newTask.project}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded ${
          errors.project ? "border-red-500" : "border-gray-300"
        }`}
        required
      >
        <option value="">Select Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
      {errors.project && (
        <p className="text-red-500 text-sm mt-1">{errors.project}</p>
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

export default TaskForm;
