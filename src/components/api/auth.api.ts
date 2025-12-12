import {
  IRegister,
  ILogin,
  IAdmin,
} from "../../components/interfaces/interfaces";
import { adminsInstance, axiosInstance } from "./axios.instance";

// Register User
export const RegisterNewUser = async (data: IRegister) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

// Login user
export const LoginUser = async (data: ILogin) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

// Update admin's data
export const AdminData = async (data: IAdmin) => {
  try {
    const response = await adminsInstance.put(`/user/update/${data.id}`, data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

// get user's id
export const getAdminsData = async () => {
  try {
    const id = JSON.parse(localStorage.getItem("amdin")!)._id;
    const response = await adminsInstance.get(`/user/${id}`);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

// get all users
export const getAllAdmins = async () => {
  try {
    const response = await adminsInstance.get("/user/");
    return response;
  } catch (e: any) {
    return e.message;
  }
};
