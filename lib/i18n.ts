import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en"; // SSR: default
  try {
    const saved = localStorage.getItem("language");
    if (saved) return saved;
  } catch (e) {
    // localStorage may throw in some environments; ignore
  }
  const browser = navigator.language || navigator.languages?.[0] || "en";
  return browser.startsWith("ar") ? "ar" : "en";
};

i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: getInitialLanguage(),   // <- use saved/browser language synchronously
    fallbackLng: "en",
    debug: false,
    initImmediate: false,        // <- synchronous init to avoid race
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    ns: ["common"],
    defaultNS: "common",
    load: "languageOnly",
    preload: ["en", "ar"],
  });

export default i18next;