'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../lib/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
  isRTL: boolean;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize language from localStorage or browser settings
    const initLanguage = async () => {
      try {
        const savedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
        const browserLang = typeof window !== 'undefined' ? navigator.language.split('-')[0] : 'en';
        const initialLang = savedLang || (browserLang === 'ar' ? 'ar' : 'en');
        
        await changeLanguage(initialLang);
      } catch (error) {
        console.warn('Failed to initialize language:', error);
      }
    };

    initLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    setLoading(true);
    try {
      // Change i18next language
      await i18n.changeLanguage(lang);
      
      // Update state
      setLanguage(lang);
      setIsRTL(lang === 'ar');
      
      // Update document attributes
      if (typeof document !== 'undefined') {
        document.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isRTL, loading }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
