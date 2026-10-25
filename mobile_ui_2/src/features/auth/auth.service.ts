import { createAuthService } from "@astra/shared";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../core/supabase";
const sharedAuth = createAuthService(supabase);
export const authService = { getSession: async (): Promise<Session | null> => { const { data, error } = await sharedAuth.getSession(); if (error) throw error; return data.session; }, subscribe: (callback: (session: Session | null) => void) => sharedAuth.subscribeToSessionChanges((session) => callback(session as Session | null)), signIn: (email: string, password: string) => sharedAuth.signInWithPassword({ email, password }), signUp: (email: string, password: string) => sharedAuth.signUp({ email, password }), signOut: () => sharedAuth.signOut() };
