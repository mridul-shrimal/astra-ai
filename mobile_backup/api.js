import { createApiClient } from "@astra/shared";

import { supabase } from "./supabase";

const api = createApiClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  getAccessToken: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token ?? null;
  },
});

export default api;
