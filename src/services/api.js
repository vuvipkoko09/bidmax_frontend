import axios from "axios";

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Backend URL đã được cấu hình tự động
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalhost ? "http://localhost:8080" : "https://bidmax-backend.onrender.com");

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  withCredentials: true, // Bổ sung dòng này để khớp với cấu hình CORS của Backend
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;