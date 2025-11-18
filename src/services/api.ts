import axios from "axios";
import { setupAxiosInterceptors } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
});

setupAxiosInterceptors(api);

export default api;
