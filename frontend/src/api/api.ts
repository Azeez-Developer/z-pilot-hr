import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5019/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically (if exists)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
