function Badge({
  children,
  variant = "primary",
  size = "md",
}) {
  const variants = {
    primary: "bg-cyan-500/15 text-cyan-400",
    success: "bg-green-500/15 text-green-500",
    warning: "bg-amber-500/15 text-amber-500",
    danger: "bg-red-500/15 text-red-500",
    info: "bg-blue-500/15 text-blue-400",
    gray: "bg-slate-500/15 text-slate-400",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        font-medium
        transition-all
        duration-300
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;