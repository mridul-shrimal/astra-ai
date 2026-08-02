function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 p-4">
      <div>
        <h3 className="font-medium">{title}</h3>

        <p className="text-sm text-slate-400">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 cursor-pointer rounded accent-cyan-500"
      />
    </div>
  );
}

export default SettingToggle;