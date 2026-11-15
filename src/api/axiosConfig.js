import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 12000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error) {
  const responseMessage = error.response?.data?.message
    || error.response?.data?.detail;

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  if (error.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }

  if (!error.response) {
    return "Could not reach Cinebook. Check your connection and try again.";
  }

  return "Cinebook could not load this information. Please try again.";
}