// removed: import useTranslation from "@/lib/hooks/useTranslation";

import useTranslation from "@/lib/hooks/useTranslation";

interface ContactDetection {
  type: "email" | "phone" | "url" | "social" | "obfuscated";
  pattern: string;
  severity: "high" | "medium" | "low";
}

export const VALIDATION_RULES = {
  title: { min: 10, max: 50 },
  description: { min: 50, max: 500 },
  estimatedBudget: { min: 1, max: 1000000 },
  location: { min: 5, max: 100 },
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export function detectContactInfo(text: string): ContactDetection[] {
  if (!text) return [];

  const detections: ContactDetection[] = [];

  // Normalize text by removing common obfuscation characters
  const normalizeText = (input: string): string =>
    input
      .toLowerCase()
      .replace(/[\s\-_.,:;|\/\\~`!@#$%^&*()+=\[\]{}'"<>?]/g, "")
      .replace(/\b(dot|d0t|d-o-t)\b/g, ".")
      .replace(/\b(at|a-t|a_t)\b/g, "@")
      .replace(/\b(zero|o)\b/g, "0")
      .replace(/\bone\b/g, "1")
      .replace(/\btwo\b/g, "2")
      .replace(/\bthree\b/g, "3")
      .replace(/\bfour\b/g, "4")
      .replace(/\bfive\b/g, "5")
      .replace(/\bsix\b/g, "6")
      .replace(/\bseven\b/g, "7")
      .replace(/\beight\b/g, "8")
      .replace(/\bnine\b/g, "9");

  const normalizedText = normalizeText(text);

  // --- patterns (emails, phones, urls, socials, etc) ---
  const emailPatterns = [
    {
      regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      type: "email" as const,
      severity: "high" as const,
    },
    {
      regex:
        /\b\w+[\s\-_.]*(?:at|@)[\s\-_.]*\w+[\s\-_.]*(?:dot|\.)[\s\-_.]*(?:com|org|net|edu|gov|io|co|uk|ae|qa)\b/gi,
      type: "obfuscated" as const,
      severity: "high" as const,
    },
  ];

  // (You can add phonePatterns, urlPatterns, socialPatterns, etc. here as needed.)

  const allPatterns = [
    ...emailPatterns,
    // ...phonePatterns,
    // ...urlPatterns,
    // ...socialPatterns,
    // ...obfuscatedPatterns,
    // ...arabicPatterns,
  ];

  // Check both original and normalized text
  [text, normalizedText].forEach((textToCheck, index) => {
    allPatterns.forEach(({ regex, type, severity }) => {
      const matches = textToCheck.match(regex);
      if (matches) {
        matches.forEach((match) => {
          const cleanMatch = match.trim();
          if (cleanMatch.length <= 2) return;

          const isDuplicate = detections.some(
            (d) =>
              d.type === type &&
              (d.pattern.includes(cleanMatch) || cleanMatch.includes(d.pattern))
          );

          if (!isDuplicate) {
            detections.push({
              type,
              pattern: cleanMatch,
              // If it was found in normalized text (index === 1) bump severity to high
              severity: index === 1 ? "high" : severity,
            });
          }
        });
      }
    });
  });

  return detections;
}
