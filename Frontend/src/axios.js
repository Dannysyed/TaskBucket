
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/';

let axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});

export default axiosInstance;