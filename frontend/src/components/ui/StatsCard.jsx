import { useTheme } from "../../context/ThemeContext";



function StatsCard({
  title,
  value,
  icon,
  color = "text-cyan-400",
}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
  className={`rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
    isLight
      ? "border-slate-200 bg-white hover:border-cyan-400 hover:shadow-xl"
      : "border-slate-800 bg-slate-900 hover:border-cyan-500"
  }`}
>
      <div className="flex justify-between items-center">

        <div>
          <p
  className={`text-sm ${
    isLight ? "text-slate-600" : "text-slate-400"
  }`}
>
            {title}
          </p>

          <h2
  className={`mt-2 text-3xl font-bold ${
    isLight ? "text-slate-900" : "text-white"
  }`}
>
            {value}
          </h2>
        </div>

        <div
  className={`${color} rounded-xl p-3 ${
    isLight ? "bg-cyan-50" : "bg-slate-800"
  }`}
>
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatsCard;