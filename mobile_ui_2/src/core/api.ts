import { createApiClient } from "@astra/shared";
import { getPublicEnvironment } from "./config";
import { supabase } from "./supabase";
export const api = createApiClient({ baseURL: getPublicEnvironment().apiUrl, getAccessToken: async () => { const { data: { session } } = await supabase.auth.getSession(); return session?.access_token ?? null; } });
