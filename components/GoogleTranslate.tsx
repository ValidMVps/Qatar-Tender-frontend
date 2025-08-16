'use client';

import { useEffect } from 'react';

let isScriptLoaded = false;

const GoogleTranslateHidden = () => {
  useEffect(() => {
    if (isScriptLoaded) return; // only run once

    // Hide toolbar completely
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate { display: none !important; }
      body { top: 0 !important; }
      #google_translate_element { display: none !important; }
    `;
    document.head.appendChild(style);

    // Add script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ar',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );

      // Auto-detect browser language
      const userLang = navigator.language;
      if (userLang.startsWith('ar')) {
        const frame = document.querySelector<HTMLIFrameElement>('iframe.goog-te-menu-frame');
        setTimeout(() => {
          if (frame) {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            const arabicOption = doc?.querySelector<HTMLDivElement>('div[lang="ar"]');
            arabicOption?.dispatchEvent(new Event('click'));
          }
        }, 1000);
      }
    };

    isScriptLoaded = true;
  }, []);

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslateHidden;
