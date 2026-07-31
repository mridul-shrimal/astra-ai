import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import SettingsSection from "./SettingsSection";

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "dark",
      label: "Dark",
      icon: Moon,
    },
    {
      id: "light",
      label: "Light",
      icon: Sun,
    },
    {
      id: "system",
      label: "System",
      icon: Monitor,
    },
  ];

  return (
    <SettingsSection
      icon={Palette}
      title="Appearance"
      description="Customize Astra AI's appearance."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {themes.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] ${
                theme === item.id
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-slate-700 hover:border-cyan-400"
              }`}
            >
              <Icon
                size={34}
                className="mx-auto mb-4 text-cyan-400"
              />

              <h3 className="text-lg font-semibold">
                {item.label}
              </h3>

              {theme === item.id && (
                <p className="mt-2 text-sm text-cyan-400">
                  Active Theme
                </p>
              )}
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}

export default AppearanceSection;