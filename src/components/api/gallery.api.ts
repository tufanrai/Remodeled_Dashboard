import { filesInstance } from "./axios.instance";
import { IImage, IUpload } from "@/components/interfaces/interfaces";

// Files
export const fectchSpecificImage = async (id: string) => {
  try {
    const response = await filesInstance.get(`/gallery/upload/${id}`);
    return response.data.success;
  } catch (err: any) {
    return err.message;
  }
};

export const fetchGalleryContents = async () => {
  try {
    const response = await filesInstance.get("/gallery");
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

export const uploadGalleryImage = async (data: IImage) => {
  try {
    const response = await filesInstance.post("/gallery/upload", data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteGalleryImage = async (id: string) => {
  try {
    const response = await filesInstance.delete(`/gallery/upload/${id}`);
    return response.data.success;
  } catch (err: any) {
    return err.message;
  }
};

// Download pdfs.
export const fetchDownloadFiles = async () => {
  try {
    const response = await filesInstance.get("/downloads");
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

export const uploadDownloadFiles = async (data: IUpload) => {
  try {
    const response = await filesInstance.post("/files/upload", data);
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteDownloadFile = async (id: string) => {
  try {
    const response = await filesInstance.delete(`/files/upload/${id}`);
    return response.data.success;
  } catch (err: any) {
    return err.message;
  }
};
