import { useTheme } from "../../context/ThemeContext";

function Card({
  title,
  children,
  className = "",
  headerAction = null,
  bodyClassName = "",
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`rounded-2xl border shadow-sm transition-all duration-300 ${
        isLight
          ? "bg-white border-slate-200 shadow-slate-200/50"
          : "bg-slate-900 border-slate-800"
      } ${className}`}
    >
      {(title || headerAction) && (
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${
            isLight
              ? "border-slate-200"
              : "border-slate-800"
          }`}
        >
          {title && (
            <h2
              className={`text-xl font-semibold ${
                isLight
                  ? "text-slate-900"
                  : "text-white"
              }`}
            >
              {title}
            </h2>
          )}

          {headerAction}
        </div>
      )}

      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

export default Card;