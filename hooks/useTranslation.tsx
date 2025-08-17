"use client";

import { useTranslation as useI18nextTranslation } from "react-i18next";
import { useEffect } from "react";
import i18n from "../lib/i18n";

export function useTranslation(ns: string = "common") {
  const result = useI18nextTranslation(ns);

  useEffect(() => {
    // Ensure i18n is initialized on client side
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);

  return result;
}
export { useTranslation as default };
