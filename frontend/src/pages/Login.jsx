import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Bot } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const isLight = theme === "light";

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      login(res.data.data.user, res.data.data.session);

      toast.success("Login Successful!");

      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-6 ${
        isLight
          ? "bg-slate-100"
          : "bg-linear-to-br from-slate-950 via-slate-900 to-slate-950"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-slate-900/70 border-slate-700 backdrop-blur-xl"
        }`}
      >
        <div className="mb-8 text-center">

          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-cyan-500/20 p-4">
              <Bot size={40} className="text-cyan-400" />
            </div>
          </div>

          <h1
            className={`text-3xl font-bold ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Astra AI
          </h1>

          <p
            className={`mt-2 ${
              isLight
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Welcome back! Sign in to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-4 text-cyan-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full rounded-xl border py-3 pl-11 pr-4 outline-none transition ${
                isLight
                  ? "border-slate-300 bg-white text-slate-900 focus:border-cyan-500"
                  : "border-slate-700 bg-slate-800 text-white focus:border-cyan-400"
              }`}
            />

          </div>

          <div className="relative">

            <Lock
              size={18}
              className="absolute left-4 top-4 text-cyan-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full rounded-xl border py-3 pl-11 pr-12 outline-none transition ${
                isLight
                  ? "border-slate-300 bg-white text-slate-900 focus:border-cyan-500"
                  : "border-slate-700 bg-slate-800 text-white focus:border-cyan-400"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-3 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <div
          className={`mt-8 text-center ${
            isLight
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;