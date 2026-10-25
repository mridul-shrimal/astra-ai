import { useEffect, useState } from "react";

import { createAuthService } from "@astra/shared";
import { supabase } from "../services/supabase";

const auth = createAuthService(supabase);

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const {
          data: { session },
        } = await auth.getSession();

        if (mounted) {
          setSession(session);
        }
      } catch {
        if (mounted) {
          setSession(null);
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
        setSession(session);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await auth.signOut();
    if (error) {
      throw error;
    }
    // Clear the shared auth session state immediately so the navigator
    // switches from the authenticated stack to the Auth stack.
    setSession(null);
  };

  const signIn = (email, password) =>
    auth.signInWithPassword({ email, password });

  const signUp = (email, password) =>
    auth.signUp({ email, password });

  return {
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
