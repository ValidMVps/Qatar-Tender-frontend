"use client";

import { useTranslation as useI18nextTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../i18n";

export function useTranslation(ns: string = "common") {
  const [isClient, setIsClient] = useState(false);
  const result = useI18nextTranslation(ns);

  useEffect(() => {
    setIsClient(true);
    // Ensure i18n is initialized on client side
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  // Return a safe fallback during SSR
  if (!isClient) {
    return {
      t: (key: string) => key, // Return the key as fallback
      i18n: {
        language: "en",
        changeLanguage: () => Promise.resolve(),
      },
      ready: false,
    };
  }

  return result;
}

export { useTranslation as default };
