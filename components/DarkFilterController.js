"use client";

import React, { useState, useEffect } from "react";

const COLOR_THEMES = [
  { name: "Default", hue: 0 },
  { name: "Blue", hue: 200 },
  { name: "Purple", hue: 280 },
  { name: "Pink", hue: 320 },
  { name: "Red", hue: 0 },
  { name: "Orange", hue: 40 },
  { name: "Yellow", hue: 60 },
  { name: "Green", hue: 120 },
  { name: "Teal", hue: 160 },
  { name: "Cyan", hue: 180 },
  { name: "Indigo", hue: 250 },
  { name: "Magenta", hue: 300 },
  { name: "Warm", hue: 30 },
  { name: "Cool", hue: 210 },
  { name: "Custom Blue", hue: 220 },
];

export default function ThemeFilter() {
  const [isDark, setIsDark] = useState(false);
  const [color, setColor] = useState(0);

  useEffect(() => {
    const invertValue = isDark ? 0.98 : 0;
    const hueRotateValue = color;
    const filter = `invert(${invertValue}) hue-rotate(${hueRotateValue}deg) brightness(1) contrast(1)`;

    // Apply main filter to the page (UI, backgrounds, text, etc.)
    document.documentElement.style.filter = filter;

    // Now define the inverse filter for media elements
    const inverseInvert = isDark ? 1 - invertValue : 0; // invert(invert(x)) = x
    const inverseHueRotate = -hueRotateValue; // opposite rotation
    const inverseFilter = `invert(${invertValue}) hue-rotate(${hueRotateValue}deg)`; // brightness/contrast already 1

    // Apply inverse filter to images, videos, canvas
    const style = document.getElementById("media-inverse-style");
    if (!style) {
      const newStyle = document.createElement("style");
      newStyle.id = "media-inverse-style";
      newStyle.textContent = `
        img, video, canvas {
          filter: ${filter} !important;
          /* Ensure it overrides any inline or other styles */
        }
      `;
      document.head.appendChild(newStyle);
    } else {
      style.textContent = `
        img, video, canvas {
          filter: ${inverseFilter} !important;
        }
      `;
    }

    // Cleanup: remove style on unmount
    return () => {
      const existingStyle = document.getElementById("media-inverse-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isDark, color]);

  return (
    <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Theme Settings
      </h2>

      {/* Dark / Light toggle */}
      <div className="flex items-center justify-between mb-4">
        <label className="text-gray-800 dark:text-gray-200">Dark Mode</label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={(e) => setIsDark(e.target.checked)}
          className="w-5 h-5"
        />
      </div>

      {/* Color Presets */}
      <label
        htmlFor="color-select"
        className="block mb-2 text-gray-800 dark:text-gray-200"
      >
        Color Theme
      </label>
      <select
        id="color-select"
        value={color}
        onChange={(e) => setColor(Number(e.target.value))}
        className="w-full p-2 rounded-md border dark:bg-gray-800 dark:text-gray-100"
      >
        {COLOR_THEMES.map((theme) => (
          <option key={theme.name} value={theme.hue}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
}
