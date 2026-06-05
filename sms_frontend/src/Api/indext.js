import axios from "axios";
import { message } from "antd";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
});

// --- STEP 1: ATTACH TOKEN TO EVERY REQUEST ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- STEP 2: HANDLE EXPIRED TOKENS ---
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Check if error is 401 and we haven't tried refreshing yet
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        handleLogout();
        return Promise.reject(err);
      }

      try {
        // IMPORTANT: The key must be 'refreshToken' to match your backend controller
        const res = await axios.post("http://localhost:8001/api/auth/refresh-token", {
          refreshToken: storedRefreshToken, 
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update the header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        handleLogout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

const handleLogout = () => {
  localStorage.clear();
  message.error("Session expired, please log in again");
  // Only redirect if we aren't already on the login page
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default api;