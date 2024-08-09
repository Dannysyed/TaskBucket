import axios from "axios";

// Register a new user
export const registerUser = async (userData) => {
  console.log(userData, "asd");
  try {
    const response = await axios.post(
      `http://localhost:3001/auth/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example protected route
export const getUsersAll = async (token) => {
  try {
    const response = await axios.get(`${"http://localhost:3001"}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch all tasks
export const fetchTasks = async (token) => {
  try {
    const response = await axios.get(`${"http://localhost:3001"}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const fetchOneTasks = async (token, taskId) => {
  try {
    const response = await axios.get(
      `${"http://localhost:3001"}/tasks/${taskId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// get project
export const getProjectsAll = async (token) => {
  try {
    const response = await axios.get(`${"http://localhost:3001"}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const createProject = async (project, token) => {
  const response = await fetch(`${"http://localhost:3001"}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  return response.json();
};

// Create a new task
export const createTask = async (token, taskData) => {
  try {
    const response = await axios.post(
      `${"http://localhost:3001"}/tasks`,
      taskData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update an existing task
export const updateTask = async (token, taskId, taskData) => {
  try {
    const response = await axios.put(
      `${"http://localhost:3001"}/tasks/${taskId}`,
      taskData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a task
export const deleteTask = async (token, taskId) => {
  try {
    const response = await axios.delete(
      `${"http://localhost:3001"}/tasks/${taskId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchComments = async (token, taskId) => {
  const response = await axios.get(`http://localhost:3001/comments/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addComment = async (token, taskId, content) => {
  const response = await axios.post(
    `http://localhost:3001/comments/${taskId}`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// src/api/index.js
export const fetchAttachments = async (token, taskId) => {
  try {
    const response = await axios.get(
      `http://localhost:3001/attachments/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error fetching attachments"
    );
  }
};

// Upload a new attachment
export const uploadAttachment = async (token, formData, taskId) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/attachments?taskId=${taskId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error uploading attachment"
    );
  }
};
