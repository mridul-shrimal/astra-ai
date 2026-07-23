import Greeting from "../components/dashboard/Greeting";
import DateTimeWidget from "../components/dashboard/DateTimeWidget";

import Card from "../components/ui/Card";
import StatsCard from "../components/ui/StatsCard";
import { useTheme } from "../context/ThemeContext";

import {
  Brain,
  HardDrive,
  Mic,
  MessageSquare,
  Activity,
  Zap,
} from "lucide-react";

function Dashboard() {
  const { theme } = useTheme();
const isLight = theme === "light";
  return (
    <div className="space-y-8">

      {/* Greeting */}
      <Greeting />

      {/* Greeting + Date & Time */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        <div className="xl:col-span-2">
          {/* Greeting already displayed above */}
        </div>

        <DateTimeWidget />

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="AI Status"
          value="Online"
          icon={<Brain size={32} />}
        />

        <StatsCard
          title="Memory"
          value="Ready"
          icon={<HardDrive size={32} />}
        />

        <StatsCard
          title="Voice"
          value="Offline"
          icon={<Mic size={32} />}
        />

        <StatsCard
          title="Chats"
          value="0"
          icon={<MessageSquare size={32} />}
        />

      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <Card title="🤖 AI Status">

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Gemini API</span>
              <span className="text-yellow-400">
                Coming Soon
              </span>
            </div>

            <div className="flex justify-between">
              <span>SQLite Memory</span>
              <span className="text-yellow-400">
                Pending
              </span>
            </div>

            <div className="flex justify-between">
              <span>Windows Control</span>
              <span className="text-yellow-400">
                Pending
              </span>
            </div>

          </div>

        </Card>

        <Card title="💬 Recent Activity">

          <div
  className={`space-y-3 ${
    isLight ? "text-slate-700" : "text-slate-300"
  }`}
>

            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              Astra project initialized
            </div>

            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              Tailwind CSS installed
            </div>

            <div className="flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" />
              Dashboard UI completed
            </div>

          </div>

        </Card>

      </div>

      {/* Quick Actions */}
      <Card title="⚡ Quick Actions">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <button className="rounded-xl bg-cyan-500 py-3 font-semibold transition hover:bg-cyan-600">
            New Chat
          </button>

          <button
  className={`rounded-xl py-3 transition ${
    isLight
      ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
  Memory
</button>

         <button
  className={`rounded-xl py-3 transition ${
    isLight
      ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
  Voice
</button>

  <button
  className={`flex items-center justify-center gap-2 rounded-xl py-3 transition ${
    isLight
      ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
  <Zap size={18} />
  Actions
</button>

        </div>

      </Card>

    </div>
  );
}

export default Dashboard;