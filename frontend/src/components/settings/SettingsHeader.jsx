import { Settings2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function SettingsHeader() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`rounded-3xl border p-8 transition-all duration-300 ${
        isLight
          ? "border-slate-200 bg-white shadow-lg shadow-slate-200/60"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30">
          <Settings2 size={30} />
        </div>

        <div>
          <h1
            className={`text-4xl font-bold ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            Settings
          </h1>

          <p
            className={`mt-2 ${
              isLight ? "text-slate-600" : "text-slate-400"
            }`}
          >
            Manage your Astra AI preferences, appearance, AI behavior and
            privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingsHeader;