import { createUploadService } from "@astra/shared";
import api from "./api";

const uploadService = createUploadService(api);

export const uploadFile = async (file, accessToken) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name || "attachment",
    type: file.type || "application/octet-stream",
  });

  const result = await uploadService.uploadFile(formData);

  if (!result?.success) {
    throw new Error(result?.message || "Upload failed");
  }

  return result.file;
};

export default uploadService;
