import axios from 'axios';

/**
 * SECRET CONFIGURATION
 * VITE_API_URL is set in your Vercel Dashboard or local .env file.
 * This keeps your backend location hidden from the source code.
 */
// Ensure the name matches your .env file exactly!
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
const API = axios.create({
  baseURL: BASE_URL,
});

// Automatically attaches JWT token to every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const token = JSON.parse(userInfo).token;
      req.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Auth Token Parsing Error", error);
    }
  }
  return req;
});

// --- AUTH ENDPOINTS ---
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const logout = () => API.post('/auth/logout');

// --- PROJECT ENDPOINTS ---
export const fetchProjects = () => API.get('/projects');
export const uploadProject = (projectData) => API.post('/projects', projectData);

// --- USER ENDPOINTS ---
export const fetchActiveUsers = () => API.get('/users/active');
export const fetchAllUsers = () => API.get('/users'); 

// --- CHAT ENDPOINTS ---
export const fetchChatHistory = () => API.get('/chat');

// --- SYSTEM HELPERS ---
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
};

export default API;
