import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if your backend port/path is different
});

// Automatically attach JWT token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Replace 'token' with your actual localStorage key
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;