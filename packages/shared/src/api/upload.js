export function createUploadApi(api) {
  return {
    uploadFile: (formData) =>
      api.post("/upload", formData, {
        // Disable the API client's JSON default so the runtime can add the
        // multipart boundary for its own FormData implementation.
        headers: {
          "Content-Type": false,
        },
      }),
  };
}
