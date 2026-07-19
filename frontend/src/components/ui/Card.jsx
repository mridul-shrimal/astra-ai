function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-cyan-400">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}

export default Card;