// LanguageProvider.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "../lib/i18n";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // initialize from i18n.language (which now was initialized with saved lang)
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window === "undefined") return i18n.language || "en";
    return localStorage.getItem("language") || i18n.language || "en";
  });

  useEffect(() => {
    // keep i18n in sync (if provider state is changed elsewhere)
    if (i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => {});
    }

    document.documentElement.lang = language;
    try {
      localStorage.setItem("language", language);
    } catch (e) {}
  }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang); // triggers effect which calls i18n.changeLanguage
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
