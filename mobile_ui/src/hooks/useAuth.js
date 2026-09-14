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
      const {
        data: { session },
      } = await auth.getSession();

      if (mounted) {
        setSession(session);
        setLoading(false);
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
    await auth.signOut();
  };

  return {
    session,
    loading,
    signOut,
  };
};

export default useAuth;
