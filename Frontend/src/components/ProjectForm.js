import React, { useState } from "react";

const ProjectForm = ({ onClose, onSave }) => {
  const [newProject, setNewProject] = useState({ name: "" });
  const [errors, setErrors] = useState({ name: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ [name]: value });

    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";
    if (fieldName === "name") {
      if (value.trim() === "") {
        error = "Project name is required";
      } else if (/^\d+$/.test(value)) {
        error = "Project name must contain at least one non-numeric character";
      } else if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
        error = "Project name cannot contain special characters";
      }
    }
    setErrors({ [fieldName]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!errors.name && newProject.name.trim() !== "") {
      onSave(newProject);
      setNewProject({ name: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
      <div>
        <label className="block mb-2 font-semibold">Project Name</label>
        <input
          type="text"
          name="name"
          value={newProject.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Project
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
};

export default ProjectForm;
