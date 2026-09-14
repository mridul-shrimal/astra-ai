import { useEffect, useState } from "react";

import {
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from "../storage/preferences";

const usePreferences = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadPreferences()
      .then((storedPreferences) => {
        if (active) {
          setPreferences(storedPreferences);
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const setPreference = (key, value) => {
    setPreferences((currentPreferences) => {
      const nextPreferences = {
        ...currentPreferences,
        [key]: value,
      };

      savePreferences(nextPreferences).catch(() => {});
      return nextPreferences;
    });
  };

  return { preferences, loading, setPreference };
};

export default usePreferences;
