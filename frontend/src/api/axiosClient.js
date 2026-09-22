import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach the JWT token to every outgoing request, if we have one
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever responds with 401, clear the stored token
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;