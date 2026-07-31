import { useState, useRef, useEffect } from "react";
import {
  LogOut,
  ArrowLeftRight,
  LayoutDashboard,
  MessageSquare,
  Brain,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

function ProfileMenu() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);

  const fullName =
    user?.user_metadata?.full_name ||
    user?.full_name ||
    "User";

  const email = user?.email || "";

  const firstName = fullName.trim().split(" ")[0];

  const initial = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, []);

  const menuItem = (Icon, label, path) => (
    <button
      onClick={() => {
        navigate(path);
        setOpen(false);
      }}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${
        theme === "light"
          ? "hover:bg-slate-100"
          : "hover:bg-slate-800"
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
          theme === "light"
            ? "bg-slate-100 hover:bg-slate-200"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 font-bold text-white">
          {initial}
        </div>

        <span
          className={`font-medium ${
            theme === "light"
              ? "text-slate-900"
              : "text-white"
          }`}
        >
          {firstName}
        </span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-3 w-72 rounded-2xl border shadow-2xl z-50 ${
            theme === "light"
              ? "border-slate-200 bg-white"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <div className="border-b border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-lg font-bold text-white">
                {initial}
              </div>

              <div>
                <h3 className="font-semibold">
                  {fullName}
                </h3>

                <p className="text-sm text-slate-400 break-all">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {menuItem(LayoutDashboard, "Dashboard", "/dashboard")}
            {menuItem(MessageSquare, "Chat", "/chat")}
            {menuItem(Brain, "Memory", "/memory")}
            {menuItem(Settings, "Settings", "/settings")}
          </div>

          <div className="border-t border-slate-700 p-2">
            <button
              onClick={() => {
                logout();
                toast("Switch account");
                navigate("/login");
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition ${
                theme === "light"
                  ? "hover:bg-slate-100"
                  : "hover:bg-slate-800"
              }`}
            >
              <ArrowLeftRight size={18} />
              Switch Account
            </button>

            <button
              onClick={() => {
                logout();
                toast.success("Logged out");
                navigate("/login");
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;