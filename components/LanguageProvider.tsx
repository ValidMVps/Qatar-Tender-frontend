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
  const [language, setLanguage] = useState<string>("en"); // Start with default
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag and initialize language from storage
    setIsClient(true);

    const initializeLanguage = () => {
      try {
        const saved = localStorage.getItem("language");
        if (saved) {
          setLanguage(saved);
          return;
        }
      } catch (e) {
        // localStorage may not be available
      }

      // Fallback to i18n language or browser language
      const fallbackLang = i18n.language || "en";
      setLanguage(fallbackLang);
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Update i18n when language changes
    if (i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => {});
    }

    // Update document language
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }

    // Save to localStorage
    try {
      localStorage.setItem("language", language);
    } catch (e) {
      // localStorage may not be available
    }
  }, [language, isClient]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
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
