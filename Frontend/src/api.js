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
