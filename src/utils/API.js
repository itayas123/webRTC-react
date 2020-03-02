import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:80/api",
  responseType: "json"
});

API.interceptors.response.use(response => {
  if (response.data.error) {
    throw new Error(response.data.error);
  } else if (response.data.data) {
    return response.data.data;
  }
  return response;
});
export default API;
