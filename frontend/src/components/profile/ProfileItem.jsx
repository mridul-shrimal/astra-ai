import { useTheme } from "../../context/ThemeContext";

function ProfileItem({
  label,
  value,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <div
      className={`flex items-center justify-between py-4 border-b last:border-b-0 ${
        isLight
          ? "border-slate-200"
          : "border-slate-800"
      }`}
    >
      <span
        className={
          isLight
            ? "text-slate-600"
            : "text-slate-400"
        }
      >
        {label}
      </span>

      <span
        className={`font-medium ${
          isLight
            ? "text-slate-900"
            : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default ProfileItem;