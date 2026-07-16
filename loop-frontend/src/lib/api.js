import axios from "axios";

// Every request automatically carries the session token and, once a
// workspace is selected, is scoped server-side by workspaceId — the
// frontend never filters tenant data itself, it only displays what the
// API returns.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("loop_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("loop_token");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;

/* ---------------------------------------------------------------------
 * Endpoint helpers — thin wrappers so pages never build URLs by hand.
 * These map 1:1 to the Express routes documented in the backend README:
 *   /api/auth, /api/feedback, /api/themes, /api/insights, /api/reports
 * ------------------------------------------------------------------- */
export const authApi = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
};

export const feedbackApi = {
  list: (params) => api.get("/feedback", { params }),
  stats: () => api.get("/feedback/stats"),
  create: (data) => api.post("/feedback", data),
  uploadCsv: (formData) =>
    api.post("/feedback/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStatus: (id, status) => api.patch(`/feedback/${id}/status`, { status }),
  reclassify: (id) => api.post(`/feedback/${id}/reclassify`),
};

export const themesApi = {
  list: () => api.get("/themes"),
  trends: (params) => api.get("/themes/trends", { params }),
};

export const insightsApi = {
  ask: (question) => api.post("/insights/ask", { question }),
};

export const reportsApi = {
  list: () => api.get("/reports"),
  generate: (days = 7) => api.post("/reports/generate", { days }),
  get: (id) => api.get(`/reports/${id}`),
};

export const membersApi = {
  list: () => api.get("/workspace/members"),
  invite: (data) => api.post("/workspace/members/invite", data),
  updateRole: (id, role) => api.patch(`/workspace/members/${id}`, { role }),
};
