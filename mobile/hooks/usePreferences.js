import { useEffect, useState } from "react";
import {
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from "../storage/preferences";

export default function usePreferences() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoading, setPreferencesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadPreferences()
      .then((value) => active && setPreferences(value))
      .catch((error) => console.warn("Failed to load preferences", error))
      .finally(() => active && setPreferencesLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const setPreference = (key, value) => {
    setPreferences((current) => {
      const next = { ...current, [key]: value };
      savePreferences(next).catch((error) =>
        console.warn("Failed to save preferences", error)
      );
      return next;
    });
  };

  return { preferences, preferencesLoading, setPreference };
}
