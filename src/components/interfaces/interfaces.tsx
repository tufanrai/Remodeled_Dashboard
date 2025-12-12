import { ERoles } from "@/lib/validations";

// Registration interface
export interface IRegister {
  name: string;
  email: string;
  contact: string;
  role: ERoles;
  password: string;
  c_password: string;
}

// Roles
export enum IRoles {
  admin = "Admin",
  user = "User",
  superAdmin = "Super Admin",
}

// Login interface
export interface ILogin {
  email: string;
  password: string;
}

// file upload
export interface IUpload {
  title: string;
  description: string;
  file: File;
  type: string;
}

export interface IDownload {
  _id: string;
  title: string;
  description: string;
  file: File;
  url: string;
  updatedAt: string;
  type: string;
}

// image upload
export interface IImage {
  image: File;
  category: string;
  alt: string;
}

// file type enum
export enum ETypes {
  events = "Event",
  downloads = "Downloads",
  news = "News",
  projects = "Projects",
}

// admin's data
export interface IAdmin {
  name?: string;
  email?: string;
  contact?: string;
  role?: string;
  id?: string;
}
