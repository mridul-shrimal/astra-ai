import { useEffect, useState } from "react";
import { createAuthService } from "@astra/shared";
import { supabase } from "../supabase";

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

  return {
    session,
    loading,
  };
};

export default useAuth;
