"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";
import { useTranslation } from "../lib/hooks/useTranslation";
import { Button } from "./ui/button";

export function LanguageToggle() {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by showing nothing during SSR
  if (!isClient) {
    return <Button className="px-4 py-2 border rounded">English</Button>;
  }

  return (
    <Button
      onClick={() => changeLanguage(language === "en" ? "ar" : "en")}
      className="px-4 py-2 border rounded"
    >
      {language === "en" ? "عربي" : "English"}
    </Button>
  );
}
