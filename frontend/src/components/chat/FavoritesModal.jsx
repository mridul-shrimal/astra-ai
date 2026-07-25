import { useTheme } from "../../context/ThemeContext";

function FavoritesModal({
  open,
  onClose,
  messages,
  onSelectMessage,
}) {
  const { theme } = useTheme();

  if (!open) return null;

  const favorites = messages.filter(
    (msg) => msg.favorite
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-full max-w-lg rounded-2xl p-6 shadow-xl ${
          theme === "light"
            ? "bg-white"
            : "bg-slate-900"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            ⭐ Favorite Messages
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <p className="text-slate-500">
            No favorite messages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {favorites.map((msg) => (
              <div
  key={msg.id}
  onClick={() => {
    onSelectMessage(msg.id);
    onClose();
  }}
  className={`cursor-pointer rounded-lg p-3 transition hover:scale-[1.02] ${
    theme === "light"
      ? "bg-slate-100 hover:bg-slate-200"
      : "bg-slate-800 hover:bg-slate-700"
  }`}
>
                <p className="line-clamp-3">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesModal;