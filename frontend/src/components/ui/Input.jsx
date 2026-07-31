import { useTheme } from "../../context/ThemeContext";

function Input({
  label,
  error,
  className = "",
  ...props
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div className="space-y-2">
      {label && (
        <label
          className={`block text-sm font-medium ${
            isLight
              ? "text-slate-700"
              : "text-slate-300"
          }`}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          px-4
          py-3
          outline-none
          transition-all
          duration-300
          ${
            isLight
              ? "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-cyan-500"
              : "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-400"
          }
          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;