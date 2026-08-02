import { useState } from "react";
import { Lock } from "lucide-react";

function AppLockOverlay({ onUnlock }) {
  const [pin, setPin] = useState("");

  const handleUnlock = () => {
    const settings =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    if (pin === settings.appPin) {
      setPin("");
      onUnlock();
    } else {
      alert("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-cyan-500/20 p-4">
            <Lock
              size={40}
              className="text-cyan-400"
            />
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Astra Locked
        </h2>

        <p className="mb-6 text-center text-slate-400">
          Enter your App PIN to continue.
        </p>

        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
          className="mb-5 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-center text-xl tracking-[10px] text-white outline-none focus:border-cyan-500"
        />

        <button
          onClick={handleUnlock}
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          Unlock Astra
        </button>
      </div>
    </div>
  );
}

export default AppLockOverlay;