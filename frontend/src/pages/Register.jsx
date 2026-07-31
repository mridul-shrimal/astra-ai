import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isLight = theme === "light";

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

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
      await api.post("/auth/signup", form);

      toast.success("Registration Successful!");

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Registration failed."
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
          : "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
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
              <Bot
                size={40}
                className="text-cyan-400"
              />
            </div>
          </div>

          <h1
            className={`text-3xl font-bold ${
              isLight
                ? "text-slate-900"
                : "text-white"
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
            Create your Astra AI account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-4 text-cyan-400"
            />

            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
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
              minLength={8}
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
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div
          className={`mt-8 text-center ${
            isLight
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          Already have an account?{" "}

          <Link
            to="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;