// components/ThemeProvider.tsx
"use client";

import { useEffect } from "react";

function applyTheme(dark) {
  const invertValue = dark ? 0.98 : 0;
  const filter = `invert(${invertValue}) hue-rotate(${dark ? 180 : 0}deg)`;
  document.documentElement.style.filter = filter;

  let style = document.getElementById("media-inverse-style") ;
  if (!style) {
    style = document.createElement("style");
    style.id = "media-inverse-style";
    document.head.appendChild(style);
  }

  style.textContent = `
    img, video, canvas, svg {
      filter: invert(${invertValue}) hue-rotate(180deg) !important;
    }
  `;
}

export function ThemeProvider({ children }) {
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    applyTheme(savedDarkMode);

    // ✅ Listen for custom event (instant update)
    const handleThemeChange = (e) => {
      const customEvent = e;
      const dark = customEvent.detail?.dark ?? false;
      applyTheme(dark);
    };
    window.addEventListener("darkModeChange", handleThemeChange);

    // 🔁 Also listen for storage (cross-tab sync)
    const handleStorage = (e) => {
      if (e.key === "darkMode") {
        applyTheme(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("darkModeChange", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return <>{children}</>;
}