import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("astra-user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (userData, session) => {
    localStorage.setItem("astra-user", JSON.stringify(userData));
    localStorage.setItem("astra-session", JSON.stringify(session));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("astra-user");
    localStorage.removeItem("astra-session");
    setUser(null);
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
