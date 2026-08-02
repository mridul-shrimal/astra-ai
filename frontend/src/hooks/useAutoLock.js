import { useEffect, useRef, useState } from "react";

function useAutoLock() {
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    console.log("🚀 Auto Lock Hook Started");

    const settings =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    console.log("Settings:", settings);

    const autoLock = settings.autoLock ?? "never";
    const appPin = settings.appPin ?? "";

    console.log("Auto Lock:", autoLock);
    console.log("PIN:", appPin);

    if (autoLock === "never") {
      console.log("Auto Lock Disabled");
      return;
    }

    if (!appPin) {
      console.log("No PIN Found");
      return;
    }

    const timeout = 10000;

    const resetTimer = () => {
      console.log("Activity");

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        console.log("LOCKING ASTRA");
        setLocked(true);
      }, timeout);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timerRef.current);

      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  return {
    locked,
    setLocked,
  };
}

export default useAutoLock;