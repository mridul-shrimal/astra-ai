import { useTheme } from "../../../context/ThemeContext";

function ScrollToBottomButton({
  showScrollButton,
}) {
  const { theme } = useTheme();

  if (!showScrollButton) return null;

  return (
    <div className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2">
      <button
        onClick={() => {
          const container =
            document.getElementById(
              "chat-export"
            );

          container?.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }}
        className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border shadow-xl transition-all duration-200 hover:scale-110 ${
          theme === "light"
            ? "border-slate-300 bg-white text-slate-700"
            : "border-slate-700 bg-slate-800 text-white"
        }`}
        title="Scroll to bottom"
      >
        ↓
      </button>
    </div>
  );
}

export default ScrollToBottomButton;