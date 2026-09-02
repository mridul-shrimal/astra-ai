function getAuth(supabase) {
  if (!supabase?.auth) {
    throw new Error("A Supabase client with an auth interface is required");
  }

  return supabase.auth;
}

export function createAuthService(supabase) {
  const auth = getAuth(supabase);

  return {
    getSession: () => auth.getSession(),

    subscribeToSessionChanges: (onSessionChange) => {
      const {
        data: { subscription },
      } = auth.onAuthStateChange((_event, session) => {
        onSessionChange(session);
      });

      return () => subscription.unsubscribe();
    },

    setSession: async (session) => {
      if (!session?.access_token || !session?.refresh_token) {
        return null;
      }

      const { data, error } = await auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      if (error) {
        throw error;
      }

      return data.session;
    },

    signOut: () => auth.signOut(),

    signInWithPassword: (credentials) =>
      auth.signInWithPassword(credentials),

    signUp: (credentials) => auth.signUp(credentials),
  };
}
