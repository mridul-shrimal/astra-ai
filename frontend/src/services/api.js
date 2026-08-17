import { createApiClient } from "@astra/shared";
import supabase from "../config/supabase";

const api = createApiClient({
  baseURL: "http://localhost:5000/api",

  getAccessToken: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  },
});

export default api;