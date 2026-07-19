import { useState, useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";

function DateTimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="bg-[#111827] rounded-2xl p-6 border border-slate-700 shadow-lg">
      <div className="flex items-center gap-2 text-cyan-400 mb-4">
        <CalendarDays size={22} />
        <h2 className="text-xl font-semibold">Date & Time</h2>
      </div>

      <p className="text-gray-300 text-lg mb-3">
        {date}
      </p>

      <div className="flex items-center gap-2 text-3xl font-bold text-white">
        <Clock size={28} className="text-cyan-400" />
        <span>{time}</span>
      </div>
    </div>
  );
}

export default DateTimeWidget;