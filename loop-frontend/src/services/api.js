import axios from "axios";

// Express is the browser-facing boundary. It resolves the workspace from the
// JWT and is the only service that talks to MongoDB or the AI service.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api", timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("loop_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("loop_token");
    return Promise.reject(error);
  },
);

export default api;
