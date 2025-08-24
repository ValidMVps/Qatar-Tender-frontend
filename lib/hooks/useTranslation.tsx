"use client";

import { useTranslation as useI18nextTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "../i18n"; // Make sure this exports configured instance

// Optional: if you want dynamic namespace loading
const DEFAULT_NS = "common";

export function useTranslation(ns: string = DEFAULT_NS) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function initI18n() {
      if (!i18n.isInitialized) {
        await i18n.init({
          // Copy your config here or keep it in i18n.ts
          lng: "en",
          fallbackLng: "en",
          defaultNS: ns,
          ns,
          backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
          },
          detection: { caches: [] },
        });
      }
      setReady(true);
    }

    initI18n();
  }, [ns]);

  const translation = useI18nextTranslation(ns);

  // Return a fake t function + not ready during init
  if (!ready) {
    return {
      t: (key: string) => key, // Fallback: show key
      i18n,
      ready: false,
    };
  }

  return translation;
}

export default useTranslation;
