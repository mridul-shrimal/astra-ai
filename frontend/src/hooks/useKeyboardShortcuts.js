import { useEffect } from "react";

export default function useKeyboardShortcuts({
  // Chat
  onNewChat,
  onPreviousChat,
  onNextChat,

  // UI
  onToggleSidebar,
  onOpenSettings,
  onExportChat,
 onOpenShortcuts,
 onCloseShortcuts,
  // Refs
  inputRef,
  searchRef,

  // Menus
  onCloseMenus,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

     // =========================
// Alt + N → New Chat
// =========================
if (
  e.altKey &&
  !e.ctrlKey &&
  !e.shiftKey &&
  e.key.toLowerCase() === "n"
) {
  e.preventDefault();

  onNewChat?.();

  return;
}

     // =========================
// Alt + K → Focus Search
// =========================
if (
  e.altKey &&
  !e.ctrlKey &&
  !e.shiftKey &&
  e.key.toLowerCase() === "k"
) {
  e.preventDefault();
  console.log("Alt + K pressed");
  console.log(searchRef);
  console.log(searchRef?.current);
  searchRef?.current?.focus();

  return;
}

      // =========================
      // / → Focus Search
      // =========================
      if (
        e.key === "/" &&
        !isTyping
      ) {
        e.preventDefault();
        searchRef?.current?.focus();
        return;
      }

      // =========================
      // Ctrl + Enter → Send Message
      // =========================
      if (
        e.ctrlKey &&
        e.key === "Enter"
      ) {
        e.preventDefault();
        inputRef?.current?.requestSubmit?.();
        return;
      }

      // =========================
      // Shift + Enter
      // Native textarea behaviour
      // =========================

    // =========================
// Alt + B → Toggle Sidebar
// =========================
if (
  e.altKey &&
  !e.ctrlKey &&
  !e.shiftKey &&
  e.key.toLowerCase() === "b"
) {
  e.preventDefault();

  console.log("Alt + B pressed");
  console.log(onToggleSidebar);

  onToggleSidebar?.();

  return;
}

      // =========================
      // Alt + E → Export Chat
      // =========================
      if (
        e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === "e"
      ) {
        e.preventDefault();
        onExportChat?.();
        return;
      }

      // =========================
      // Alt + , → Settings
      // =========================
      if (
        e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        e.key === ","
      ) {
        e.preventDefault();
        onOpenSettings?.();
        return;
      }

      // =========================
      // Alt + ↑ → Previous Chat
      // =========================
      if (
        e.altKey &&
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        onPreviousChat?.();
        return;
      }

      // =========================
      // Alt + ↓ → Next Chat
      // =========================
      if (
        e.altKey &&
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        onNextChat?.();
        return;
      }
// =========================
// F1 → Keyboard Shortcuts
// =========================
if (e.key === "F1") {
  e.preventDefault();
  onOpenShortcuts?.();
  return;
}

// =========================
// Alt + / → Keyboard Shortcuts
// =========================
if (
  e.altKey &&
  !e.ctrlKey &&
  !e.shiftKey &&
  e.key === "/"
) {
  e.preventDefault();
  onOpenShortcuts?.();
  return;
}
      // =========================
      // Esc → Close Menus
      // =========================
      if (e.key === "Escape") {
  onCloseMenus?.();
  onCloseShortcuts?.();

  document.activeElement?.blur();
}
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    onNewChat,
    onPreviousChat,
    onNextChat,
    onToggleSidebar,
    onOpenSettings,
    onExportChat,
    onCloseMenus,
    inputRef,
    searchRef,
    onOpenShortcuts,
  ]);
}