'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useTranslation } from 'react-i18next';


export function LanguageToggle() {
  const { language, changeLanguage, loading } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    if (!loading) {
      const newLang = language === 'en' ? 'ar' : 'en';
      changeLanguage(newLang);
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={loading}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg
        border border-gray-200 hover:border-gray-300
        bg-white hover:bg-gray-50
        transition-colors duration-200
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${language === 'ar' ? 'space-x-reverse' : ''}
      `}
      aria-label={t('Switch language')}
    >
      <Globe className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}
