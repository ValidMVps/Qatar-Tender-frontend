// lib/hooks/useTranslation.ts
import { useTranslation as useI18nextTranslation } from "react-i18next";
import { useEffect } from "react";
import i18n from "../i18n";

export function useTranslation(ns: string = "common") {
  const result = useI18nextTranslation(ns);

  useEffect(() => {
    // init only on the client if needed
    if (!i18n.isInitialized) {
      // init returns a promise; swallow errors to avoid breaking render
      i18n.init().catch(() => {});
    }
  }, []);

  return result;
}

export default useTranslation;
