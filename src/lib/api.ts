import axios from "axios";
import type {
  IImage,
  ILogin,
  IRegister,
} from "@/components/interfaces/interfaces";
import Cookies from "js-cookie";
import { IProject, INews, IReports, IUpdateProject } from "./validations";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Loging in the admins
const authenticate_admin = axios.create({
  baseURL: API_BASE_URL,
});

// CRUD Operations
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${Cookies.get("access")}`,
  },
});

// Image API
export const imageApiCreate = async (data: IImage) => {
  try {
    console.log("AxiosInterface:", data);
    const response = await api.post("/gallery/upload/", data);
    return response.data;
  } catch (err: any) {
    return err;
  }
};

export const imageApiGetAll = async () => {
  try {
    const response = await api.get("/gallery/");
    return response.data;
  } catch (err: any) {
    return err;
  }
};

export const imageApiGetById = async (id: string) => {
  try {
    const response = await api.get(`/gallery/upload/${id}`);
    return response.data;
  } catch (err: any) {
    return err;
  }
};

export const imageApiUpdate = async (data: IImage) => {
  try {
    const id = sessionStorage.getItem("file")!;
    const response = await api.put(`/gallery/upload/${id}`, data);
    return response.data;
  } catch (err: any) {
    return err;
  }
};

export const imageApiDelete = async (id: string) => {
  try {
    const response = await api.delete(`/gallery/upload/${id}`);
    return response.data;
  } catch (err: any) {
    return err;
  }
};

// Project API
export const projectApi = {
  create: (data: any) => api.post("/files/upload/", data),
  getAll: () => api.get("/files"),
  getById: (id: string) => api.get(`/files/${id}`),
  update: async (data: IUpdateProject) => {
    const id = sessionStorage.getItem("file");
    const resp = await authenticate_admin.put(`/files/upload/${id}`, data);
    return resp;
  },
  delete: (id: string) => api.delete(`/files/upload/${id}`),
};

// News API
export const newsApi = {
  create: (data: INews) => api.post("/news/upload/", data),
  getAll: () => api.get("/news"),
  getById: (id: string) => api.get(`/news/${id}`),
  update: async (data: Partial<INews>) => {
    const id = sessionStorage.getItem("file");
    const resp = await api.put(`/news/update/${id}`, data);
    return resp.data;
  },
  delete: (id: string) => api.delete(`/news/update/${id}`),
};

// Reports API
export const reportsApi = {
  create: (data: IReports) => api.post("/reports/upload/", data),
  getAll: () => api.get("/reports"),
  getById: (id: string) => api.get(`/reports/${id}`),
  update: (data: Partial<IReports>) => {
    const id = sessionStorage.getItem("file");
    api.put(`/reports/upload/${id}`, data);
  },
  delete: (id: string) => api.delete(`/reports/upload/${id}`),
};

// Login API
export const logAdmin = async (data: ILogin) => {
  try {
    const response = await authenticate_admin.post("/api/auth/login", data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

// Register Admin API
export const registerApi = {
  create: (data: IRegister) =>
    authenticate_admin.post("api/auth/register", data),
  getAll: () => api.get("/user/"),
  getById: (id: string) => api.get(`/user/${id}`),
  update: async (data: IRegister) => {
    const id = sessionStorage.getItem("admin");
    const resp = await authenticate_admin.put(`/user/update/${id}`, data);
    return resp.data;
  },
  delete: (id: string) => authenticate_admin.delete(`/user/${id}`),
};

export default api;
