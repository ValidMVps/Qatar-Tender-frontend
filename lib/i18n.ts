import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

const getInitialLanguage = () => {
  // Always return 'en' during SSR
  if (typeof window === "undefined") return "en";

  try {
    const saved = localStorage.getItem("language");
    if (saved) return saved;
  } catch (e) {
    // localStorage may throw in some environments; ignore
  }

  try {
    const browser = navigator.language || navigator.languages?.[0] || "en";
    return browser.startsWith("ar") ? "ar" : "en";
  } catch (e) {
    return "en";
  }
};

const i18nInstance = i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) =>
      import(`../locales/${language}/${namespace}.json`)
    )
  );

// Only initialize on client side
if (typeof window !== "undefined") {
  i18nInstance.init({
    lng: getInitialLanguage(),
    fallbackLng: "en",
    debug: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    ns: ["common"],
    defaultNS: "common",
    load: "languageOnly",
    preload: ["en", "ar"],
  });
} else {
  // Server-side: create a minimal config
  i18nInstance.init({
    lng: "en",
    fallbackLng: "en",
    debug: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    ns: ["common"],
    defaultNS: "common",
    resources: {
      en: {
        common: {}
      }
    }
  });
}

export default i18nInstance;