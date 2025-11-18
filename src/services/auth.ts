import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export interface AuthResponse {
  token: string;
  expiresAtMillis: number;
}

export const register = (email: string, password: string, name?: string) =>
  axios.post(`${API}/api/auth/register`, { email, password, name });

export const login = async (email: string, password: string) => {
  const res = await axios.post<AuthResponse>(`${API}/api/auth/login`, {
    email,
    password,
  });

  const { token, expiresAtMillis } = res.data;

  localStorage.setItem("token", token);
  localStorage.setItem("token_expires", String(expiresAtMillis));

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expires");

  window.dispatchEvent(new Event("authChange"));
};


export const getToken = () => localStorage.getItem("token");

export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded: any = jwtDecode(token);
    if (decoded?.exp) return Date.now() > decoded.exp * 1000;

    const stored = localStorage.getItem("token_expires");
    return stored ? Date.now() > Number(stored) : false;
  } catch {
    return true;
  }
};

export const getUserEmailFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
};


export const setupAxiosInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        logout();
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }
  );
};
