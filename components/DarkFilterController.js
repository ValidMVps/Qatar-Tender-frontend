"use client";

import { useEffect, useState } from "react";

export default function DarkFilterController() {
  const [invert, setInvert] = useState(0.95);
  const [hue, setHue] = useState(180);
  const [brightness, setBrightness] = useState(0.92);
  const [contrast, setContrast] = useState(1);

  // Apply filter whenever values change
  useEffect(() => {
    document.documentElement.style.filter = `
      invert(${invert}) hue-rotate(${hue}deg) brightness(${brightness}) contrast(${contrast})
    `;
  }, [invert, hue, brightness, contrast]);

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 shadow-lg rounded-xl p-4 z-50 space-y-3 w-72">
      <h2 className="text-sm font-semibold">Dark Mode Filter Controls</h2>

      {/* Invert */}
      <label className="flex flex-col text-xs">
        Invert: {invert}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={invert}
          onChange={(e) => setInvert(Number(e.target.value))}
        />
      </label>

      {/* Hue */}
      <label className="flex flex-col text-xs">
        Hue: {hue}°
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={hue}
          onChange={(e) => setHue(Number(e.target.value))}
        />
      </label>

      {/* Brightness */}
      <label className="flex flex-col text-xs">
        Brightness: {brightness}
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
        />
      </label>

      {/* Contrast */}
      <label className="flex flex-col text-xs">
        Contrast: {contrast}
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={contrast}
          onChange={(e) => setContrast(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
