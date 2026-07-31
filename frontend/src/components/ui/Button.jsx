import { Loader2 } from "lucide-react";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "bg-cyan-500 text-white hover:bg-cyan-600",

    secondary:
      "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",

    success:
      "bg-green-500 text-white hover:bg-green-600",

    danger:
      "bg-red-500 text-white hover:bg-red-600",

    outline:
      "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",

    md: "px-5 py-3",

    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2
        rounded-xl
        font-semibold
        transition-all
        duration-300
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}

      {children}
    </button>
  );
}

export default Button;