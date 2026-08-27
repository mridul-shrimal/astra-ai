import { createApiClient } from "@astra/shared";
import { supabase } from "./supabase";

const API_URL = "http://10.138.130.152:5000/api";

const api = createApiClient({
  baseURL: API_URL,

  getAccessToken: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  },
});

export { api };
export default api;