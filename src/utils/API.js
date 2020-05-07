import axios from "axios";
import { TOKEN } from "../stores/userStore";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  responseType: "json",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN);
  if (token) {
    config.headers[TOKEN] = token;
  }
  return config;
});

API.interceptors.response.use(
  (response) => {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response.data;
    if (errorMessage) {
      console.error(errorMessage);
      throw new Error(errorMessage.error);
    }
    throw error;
  }
);
export default API;
