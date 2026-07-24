import { useEffect } from "react";

export default function useKeyboardShortcuts({
  onNewChat,
  inputRef,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {

      // Ctrl + Alt + N → New Chat
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        onNewChat();
      }

      // Ctrl + Alt + M → Focus Message Box
if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "m") {
  e.preventDefault();

  console.log("Shortcut Pressed");
  console.log("inputRef =", inputRef);
  console.log("current =", inputRef.current);

  if (inputRef.current) {
    inputRef.current.focus();

console.log("Active element:", document.activeElement);
  }
}

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNewChat, inputRef]);
}