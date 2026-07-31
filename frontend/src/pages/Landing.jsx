import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Landing() {
  const { user } = useAuth();

  // Already logged in? Go to Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="max-w-xl text-center">

        <h1 className="mb-4 text-5xl font-bold text-cyan-400">
          Astra AI
        </h1>

        <p className="mb-3 text-xl text-white">
          Your Personal AI Assistant
        </p>

        <p className="mb-10 text-slate-400">
          Chat • Memory • Voice • Automation
        </p>

        <div className="flex justify-center gap-4">

          <Link
            to="/login"
            className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl border border-cyan-500 px-8 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
          >
            Register
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Landing;