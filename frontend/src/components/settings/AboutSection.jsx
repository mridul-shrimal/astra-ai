import {
  Bot,
  Globe,
  Sparkles,
  CheckCircle,
} from "lucide-react";

import SettingsSection from "./SettingsSection";

function AboutSection() {
  return (
    <SettingsSection
      icon={Bot}
      title="About Astra AI"
      description="Application information and developer details."
    >
      <div className="flex items-center gap-5 rounded-2xl border border-slate-700 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30">
          <Sparkles size={36} />
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            Astra AI
          </h3>

          <p className="text-slate-400">
            Your Personal AI Assistant
          </p>

          <span className="mt-2 inline-block rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-400">
            Version 1.0.0
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-slate-700 p-5">
          <h3 className="mb-2 font-semibold">
            AI Provider
          </h3>

          <p className="text-slate-400">
            Gemini API (Current)
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 p-5">
          <h3 className="mb-2 font-semibold">
            Developer
          </h3>

          <p className="text-slate-400">
            Mridul Shrimal
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 p-5">
          <h3 className="mb-2 font-semibold">
            Framework
          </h3>

          <p className="text-slate-400">
            React + Vite + Tailwind CSS
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 p-5">
          <h3 className="mb-2 font-semibold">
            Backend
          </h3>

          <p className="text-slate-400">
            Supabase
          </p>
        </div>

      </div>

      <div className="flex flex-wrap gap-4">

        <button className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 transition hover:border-cyan-500">
          <Globe size={18} />
GitHub
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 transition hover:border-cyan-500">
          <Globe size={18} />
          Website
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-white transition hover:bg-cyan-600">
          <CheckCircle size={18} />
          Check for Updates
        </button>

      </div>
    </SettingsSection>
  );
}

export default AboutSection;