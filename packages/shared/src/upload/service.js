import { createUploadApi } from "../api/upload.js";

function getSuccessfulData(response) {
  const data = response?.data;

  if (!data?.success) {
    throw new Error(data?.message || "Failed to upload file.");
  }

  return data;
}

export function createUploadService(api) {
  const uploadApi = createUploadApi(api);

  return {
    async uploadFile(formData) {
      if (!formData) {
        throw new Error("Upload form data is required.");
      }

      return getSuccessfulData(
        await uploadApi.uploadFile(formData)
      );
    },
  };
}
