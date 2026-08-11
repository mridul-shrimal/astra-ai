import axios from "axios";
import { supabase } from "./supabase";

const API_URL = "http://10.118.48.152:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================================
// ATTACH SUPABASE ACCESS TOKEN
// =========================================================

api.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${session.access_token}`;
    } else {
      console.log(
        "⚠️ API REQUEST: No Supabase session token"
      );
    }
  } catch (error) {
    console.log(
      "❌ API AUTH INTERCEPTOR ERROR:",
      error.message
    );
  }

  return config;
});

export default api;