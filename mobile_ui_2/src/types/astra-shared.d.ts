declare module "@astra/shared" {
  import type { AxiosInstance } from "axios";
  import type { SupabaseClient } from "@supabase/supabase-js";
  export function createApiClient(options: { baseURL: string; getAccessToken: () => Promise<string | null> }): AxiosInstance;
  export function createAuthService(supabase: SupabaseClient): { getSession: () => ReturnType<SupabaseClient["auth"]["getSession"]>; subscribeToSessionChanges: (callback: (session: unknown) => void) => () => void; signOut: () => ReturnType<SupabaseClient["auth"]["signOut"]>; signInWithPassword: (credentials: { email: string; password: string }) => ReturnType<SupabaseClient["auth"]["signInWithPassword"]>; signUp: (credentials: { email: string; password: string }) => ReturnType<SupabaseClient["auth"]["signUp"]>; };
}
