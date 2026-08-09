import axios from "axios";
import supabase from "../config/supabase";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization =
        `Bearer ${session.access_token}`;
    }

console.log(
  "🌐 API REQUEST:",
  config.method?.toUpperCase(),
  config.baseURL + config.url
);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;