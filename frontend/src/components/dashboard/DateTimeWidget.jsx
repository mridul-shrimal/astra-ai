import { useState, useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function DateTimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
const { theme } = useTheme();
const isLight = theme === "light";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
  className={`rounded-2xl border p-6 shadow-lg transition-all duration-300 ${
    isLight
      ? "border-slate-200 bg-white shadow-slate-200/60"
      : "border-slate-700 bg-[#111827]"
  }`}
>
      <div
  className={`mb-4 flex items-center gap-2 ${
    isLight ? "text-cyan-700" : "text-cyan-400"
  }`}
>
        <CalendarDays size={22} />
        <h2 className="text-xl font-semibold">Date & Time</h2>
      </div>

      <p
  className={`mb-3 text-lg ${
    isLight ? "text-slate-700" : "text-gray-300"
  }`}
>
        {date}
      </p>

      <div
  className={`flex items-center gap-2 text-3xl font-bold ${
    isLight ? "text-slate-900" : "text-white"
  }`}
>
        <Clock size={28} className="text-cyan-400" />
        <span>{time}</span>
      </div>
    </div>
  );
}

export default DateTimeWidget;