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
  const [language, setLanguage] = useState<string>(() => {
    if (typeof window === "undefined") return i18n.language || "en";
    return localStorage.getItem("language") || i18n.language || "en";
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";

    i18n.changeLanguage(savedLang).then(() => {
      setLanguage(savedLang);
      document.documentElement.lang = savedLang;
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = language;
    localStorage.setItem("language", language);
    i18n.changeLanguage(language).catch(() => {});
  }, [language, ready]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  if (!ready) return null; // Prevent render until language is ready

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
