import * as yup from "yup";

// Enums
export enum EStatus {
  Ongoing = "Ongoing",
  Planning = "Planning",
  Completed = "Completed",
}

export enum EReports {
  Annual = "annual",
  SemiAnnual = "semi-annual",
}

export enum ERoles {
  SuperAdmin = "Super admin",
  Admin = "Admin",
}

// Image Schema
export const imageSchema = yup.object({
  image: yup
    .mixed<File>()
    .required("Please upload a file")
    .test(
      "fileExists",
      "Please upload a file",
      (value) => value instanceof File
    ),
  category: yup.string().required("Category is required"),
  alt: yup
    .string()
    .required("Alt text is required")
    .max(200, "Alt text must be less than 200 characters"),
});

// Image Schema
export const imageUpdateSchema = yup.object({
  image: yup
    .mixed<File>()
    .test(
      "fileExists",
      "Please upload a file",
      (value) => value instanceof File
    ),
  category: yup.string(),
  alt: yup.string().max(200, "Alt text must be less than 200 characters"),
});

export interface IImage {
  image: File;
  category: string;
  alt: string;
}

export interface ImageData {
  url: string;
  alt: string;
  title?: string;
}

// Timeline Schema
export const timelineSchema = yup.object({
  year: yup.string().required("Year is required"),
  milestone: yup.string().required("Milestone is required"),
});

export type ITimeline = yup.InferType<typeof timelineSchema>;

// Technical Specs Schema
export const techSpecsSchema = yup.object({
  Type: yup.string().required("Project type is required"),
  headHeight: yup.string().required("Head height is required"),
  turbineType: yup.string().required("Turbine type is required"),
  annualGeneration: yup.string().required("Annual generation is required"),
  gridConnection: yup.string().required("Grid connection is required"),
});

export type ITechSpecs = yup.InferType<typeof techSpecsSchema>;

// Project Schema
export const projectSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: yup.string().required("Description is required"),
  capacity: yup.string().required("Capacity is required"),
  status: yup
    .mixed<EStatus>()
    .oneOf(Object.values(EStatus))
    .required("Status is required"),
  location: yup.string().required("Location is required"),
  startYear: yup.string().required("Start year is required"),
  features: yup
    .string()
    .min(1, "At least one feature is required")
    .required("Features are required"),
  fullDescription: yup.string().required("Full description is required"),
  file: yup
    .mixed<File>()
    .required("Please upload a file")
    .test(
      "fileExists",
      "Please upload a file",
      (value) => value instanceof File
    ),
  technicalSpecs: techSpecsSchema.required("Technical specs are required"),
  timeline: yup
    .string()
    .min(1, "At least one timeline entry is required")
    .required("Timeline is required"),
});

export type IProject = yup.InferType<typeof projectSchema>;

// Update project
export const updateProjectSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: yup.string().required("Description is required"),
  capacity: yup.string().required("Capacity is required"),
  status: yup
    .mixed<EStatus>()
    .oneOf(Object.values(EStatus))
    .required("Status is required"),
  location: yup.string().required("Location is required"),
  startYear: yup.string().required("Start year is required"),
  features: yup
    .string()
    .min(1, "At least one feature is required")
    .required("Features are required"),
  fullDescription: yup.string().required("Full description is required"),
  file: yup.mixed<File>(),
  technicalSpecs: techSpecsSchema.required("Technical specs are required"),
  timeline: yup
    .string()
    .min(1, "At least one timeline entry is required")
    .required("Timeline is required"),
});

export type IUpdateProject = yup.InferType<typeof updateProjectSchema>;

// News Schema
export const newsSchema = yup.object({
  file: yup
    .mixed<File>()
    .required("Please upload a file")
    .test(
      "fileExists",
      "Please upload a file",
      (value) => value instanceof File
    ),
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  excerpt: yup
    .string()
    .required("Excerpt is required")
    .max(300, "Excerpt must be less than 300 characters"),
  date: yup.string().required("Date is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
});

export type INews = yup.InferType<typeof newsSchema>;

// Reports Schema
export const reportsSchema = yup.object({
  file: yup
    .mixed<File>()
    .required("Please upload a file")
    .test(
      "fileExists",
      "Please upload a file",
      (value) => value instanceof File
    ),
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),
  type: yup
    .mixed<EReports>()
    .oneOf(Object.values(EReports))
    .required("Report type is required"),
  date: yup.string().required("Date is required"),
  pages: yup
    .string()
    .required("Number of pages is required")
    .matches(/^\d+$/, "Pages must be a number"),
});

export type IReports = yup.InferType<typeof reportsSchema>;

// 3D Model Schema
export const modelSchema = yup.object({
  file: yup.string().required("3D model file is required"),
  previewImage: yup.string().required("Preview image is required"),
  name: yup
    .string()
    .required("Model name is required")
    .max(100, "Name must be less than 100 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export type IModel = yup.InferType<typeof modelSchema>;

// Admin Schema
export const adminSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  contact: yup.string().required("Contact is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type IAdmin = yup.InferType<typeof adminSchema>;

// Register schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  contact: yup.string().required("Contact is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: yup
    .string()
    .required("please specify your role")
    .oneOf([ERoles.Admin, ERoles.SuperAdmin], "role didn't match"),
});

// Login schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  contact: yup.string().required("Contact is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
