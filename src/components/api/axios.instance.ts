import axios from "axios";
import Cookies from "js-cookie";

const uri = import.meta.env.VITE_API_BASE_URL!;

const accessToken = Cookies.get("access")!;

export const axiosInstance = axios.create({
  baseURL: uri,
});

export const adminsInstance = axios.create({
  baseURL: uri,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
export const filesInstance = axios.create({
  baseURL: uri,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "multipart/form-data",
  },
});
