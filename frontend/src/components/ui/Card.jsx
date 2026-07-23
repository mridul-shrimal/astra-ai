import { useTheme } from "../../context/ThemeContext";



function Card({ title, children }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
  className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 ${
    isLight
      ? "border-slate-200 bg-white shadow-slate-200/60"
      : "border-slate-800 bg-slate-900"
  }`}
>
      {title && (
        <h3
  className={`mb-4 text-lg font-semibold ${
    isLight ? "text-cyan-700" : "text-cyan-400"
  }`}
>
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}

export default Card;