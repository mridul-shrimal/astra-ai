import { useState } from "react";
import { supabase } from "../supabase";

const useAuthActions = () => {
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email, password) => {
    if (!email || !password) {
      return {
        success: false,
        message: "Please enter email and password.",
      };
    }

    try {
      setAuthLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.log(
          "❌ LOGIN ERROR:",
          error.message
        );

        return {
          success: false,
          message: error.message,
        };
      }

      console.log("✅ LOGIN SUCCESS");

      return {
        success: true,
      };
    } catch (error) {
      console.log(
        "❌ LOGIN ERROR:",
        error.message
      );

      return {
        success: false,
        message:
          error.message ||
          "Login failed.",
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (email, password) => {
    if (!email || !password) {
      return {
        success: false,
        message: "Please enter email and password.",
      };
    }

    try {
      setAuthLoading(true);

      const { error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {
        console.log(
          "❌ SIGNUP ERROR:",
          error.message
        );

        return {
          success: false,
          message: error.message,
        };
      }

      console.log("✅ SIGNUP SUCCESS");

      return {
        success: true,
      };
    } catch (error) {
      console.log(
        "❌ SIGNUP ERROR:",
        error.message
      );

      return {
        success: false,
        message:
          error.message ||
          "Signup failed.",
      };
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    login,
    register,
    authLoading,
  };
};

export default useAuthActions;