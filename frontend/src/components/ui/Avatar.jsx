import { UserCircle2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function Avatar({
  name = "User",
  image = "",
  size = "md",
  showStatus = false,
}) {
  const { theme } = useTheme();

  const isLight = theme === "light";

  const firstLetter = name.trim().charAt(0).toUpperCase();

  const sizes = {
    sm: "h-10 w-10 text-lg",
    md: "h-14 w-14 text-2xl",
    lg: "h-24 w-24 text-5xl",
    xl: "h-32 w-32 text-6xl",
  };

  return (
    <div className="relative inline-block">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover border ${
            isLight
              ? "border-slate-300"
              : "border-slate-700"
          }`}
        />
      ) : (
        <div
          className={`${sizes[size]} flex items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-blue-600 font-bold text-white shadow-lg`}
        >
          {firstLetter || <UserCircle2 />}
        </div>
      )}

      {showStatus && (
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      )}
    </div>
  );
}

export default Avatar;