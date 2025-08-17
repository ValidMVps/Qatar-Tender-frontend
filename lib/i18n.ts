import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Initialize i18next
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => 
      import(`../locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    
    react: {
      useSuspense: false,
    },
    
    // Default namespace
    ns: ['common'],
    defaultNS: 'common',
    
    // Load resources
    load: 'languageOnly',
    preload: ['en', 'ar'],
  });

export default i18next;