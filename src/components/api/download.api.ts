import { filesInstance } from "./axios.instance";

const fetchDownloadFiles = async () => {
  try {
    const response = await filesInstance.get("/files");
    return response.data;
  } catch (err: any) {
    return err.message;
  }
};

export default fetchDownloadFiles;
