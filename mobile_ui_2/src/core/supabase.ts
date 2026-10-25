import { createClient } from "@supabase/supabase-js";
import { getPublicEnvironment } from "./config";
import { secureStorage } from "./storage";
const environment = getPublicEnvironment();
export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, { auth: { storage: secureStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } });
