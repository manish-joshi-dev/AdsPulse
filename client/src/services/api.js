import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 90000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adspulse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

