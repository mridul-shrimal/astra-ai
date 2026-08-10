import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kaueczxoqeorqqgkdpqz.supabase.co";
const supabaseAnonKey = "sb_publishable_BoDtRgqVp9uO_5T-7EtQ0g_CZTVDKEG";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);