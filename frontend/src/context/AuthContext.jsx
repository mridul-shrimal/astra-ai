import { createContext, useEffect, useState } from "react";
import { createAuthService } from "@astra/shared";
import supabase from "../config/supabase";

export const AuthContext = createContext();

const auth = createAuthService(supabase);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await auth.getSession();

        if (error) {
          console.error("❌ Session Error:", error);
        }

        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("❌ Failed to restore session:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    const unsubscribe = auth.subscribeToSessionChanges((session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (userData, session) => {
    try {
      if (session?.access_token && session?.refresh_token) {
        await auth.setSession(session);
      }

      setUser(userData);
    } catch (error) {
      console.error("❌ Login Session Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await auth.signOut();

      if (error) {
        console.error("❌ Logout Error:", error);
      }
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
