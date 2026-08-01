import { useTheme } from "../../../context/ThemeContext";

function StopGenerating({
  isGenerating,
  onStopGenerating,
}) {
  const { theme } = useTheme();

  if (!isGenerating) return null;

  return (
    <div className="my-4 flex justify-center">
      <button
        onClick={onStopGenerating}
        className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 sm:px-5 sm:text-base ${
          theme === "light"
            ? "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
            : "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        }`}
      >
        ⏹ Stop Generating
      </button>
    </div>
  );
}

export default StopGenerating;