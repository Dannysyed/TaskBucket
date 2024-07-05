import axiosInstance from "./axios";

// Register a new user
export const registerUser = async (userData) => {
  console.log(userData, "asd");
  try {
    const response = await axiosInstance.post(
      `auth/register`,
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
    const response = await axiosInstance.post(
      `auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example protected route
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(`users`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
