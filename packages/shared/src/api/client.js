import axios from "axios";

/**
 * Creates an authenticated Astra API client.
 *
 * The platform supplies:
 * - baseURL: backend API URL
 * - getAccessToken: function that returns the current Supabase access token
 */
export function createApiClient({ baseURL, getAccessToken }) {
  if (!baseURL) {
    throw new Error("API baseURL is required");
  }

  if (typeof getAccessToken !== "function") {
    throw new Error("getAccessToken must be a function");
  }

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    async (config) => {
      const accessToken = await getAccessToken();

      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
}