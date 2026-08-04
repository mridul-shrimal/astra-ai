import { useEffect, useRef, useState } from "react";

function useAutoLock() {
  const [locked, setLocked] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    

    const settings =
      JSON.parse(localStorage.getItem("astra-settings")) || {};

    

    const autoLock = settings.autoLock ?? "never";
    const appPin = settings.appPin ?? "";

   

    if (autoLock === "never") {
      
      return;
    }

    if (!appPin) {
      
      return;
    }

    const timeout = 10000;

    const resetTimer = () => {
     

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
       
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