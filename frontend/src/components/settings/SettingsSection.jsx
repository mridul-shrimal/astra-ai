import { useTheme } from "../../context/ThemeContext";

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`rounded-3xl border p-7 transition-all duration-300 ${
        isLight
          ? "border-slate-200 bg-white shadow-sm"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <div className="mb-6 flex items-start gap-4">

        <div className="rounded-xl bg-cyan-500/10 p-3">
          <Icon
            size={24}
            className="text-cyan-400"
          />
        </div>

        <div>
          <h2
            className={`text-2xl font-semibold ${
              isLight
                ? "text-slate-900"
                : "text-white"
            }`}
          >
            {title}
          </h2>

          {description && (
            <p
              className={`mt-1 ${
                isLight
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              {description}
            </p>
          )}
        </div>

      </div>

      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}

export default SettingsSection;