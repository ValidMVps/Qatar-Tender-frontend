"use client";

interface ContactDetection {
  type:
    | "email"
    | "phone"
    | "url"
    | "social"
    | "obfuscated"
    | "arabic"
    | "username";
  pattern: string;
  severity: "high" | "medium" | "low";
  confidence: number;
  context?: string;
  rawPattern?: string;
}

export const VALIDATION_RULES = {
  title: { min: 10, max: 50 },
  description: { min: 50, max: 500 },
  estimatedBudget: { min: 1, max: 5000000 },
  location: { min: 5, max: 100 },
  maxFileSize: 5 * 1024 * 1024,
};

const FALSE_POSITIVES = [
  "example.com",
  "test.com",
  "demo.com",
  "sample.com",
  "placeholder.com",
  "no-reply@",
  "donotreply@",
  "noreply@",
  "info@",
  "support@",
  "contact@",
  "help@",
  "admin@",
  "hello@",
  "sales@",
  "marketing@",
  "team@",
  "service@",
  "customerservice@",
  "feedback@",
  "updates@",
  "notifications@",
  "noreply@",
  "no-reply@",
  "no_reply@",
  "do_not_reply@",
  "reply@",
  "replies@",
  "reply-to@",
  "replyto@",
  "reply_to@",
  "webmaster@",
  "office@",
];

const CONTEXT_CLUES = [
  "contact",
  "email",
  "phone",
  "mobile",
  "tel",
  "whatsapp",
  "telegram",
  "viber",
  "messenger",
  "social",
  "media",
  "chat",
  "reach me",
  "call me",
  "text me",
  "message me",
  "connect",
  "follow",
  "online",
  "website",
  "site",
  "link",
  "url",
  "www",
  "dm",
  "direct message",
  "inbox",
  "pm",
  "private message",
  "reach out",
  "get in touch",
  "get in contact",
  "contact me",
  "email me",
  "call me",
  "text me",
  "message me",
  "connect with me",
  "follow me",
  "add me",
  "friend me",
  "connect on",
  "follow on",
  "add on",
  "friend on",
  "message on",
  "contact on",
  "reach on",
];

const COMMON_WORDS_FOR_DOMAINS = [
  "website",
  "site",
  "online",
  "web",
  "app",
  "service",
  "contact",
  "info",
  "support",
  "help",
  "business",
  "company",
  "professional",
  "service",
  "services",
  "company",
  "corporation",
  "inc",
  "llc",
  "ltd",
  "group",
  "network",
  "systems",
  "solutions",
  "consulting",
  "consultants",
  "agency",
  "agencies",
  "store",
  "shop",
  "market",
  "store",
  "shop",
  "tech",
  "technology",
  "digital",
  "online",
  "internet",
];

const EMAIL_INDICATOR_WORDS = [
  "email",
  "e-mail",
  "mail",
  "contact",
  "reach",
  "message",
  "connect",
  "follow",
];

const CONTACT_KEYWORDS = [
  "contact",
  "email",
  "phone",
  "mobile",
  "tel",
  "whatsapp",
  "telegram",
  "viber",
  "messenger",
  "social",
  "media",
  "chat",
  "reach",
  "call",
  "text",
  "message",
  "connect",
  "follow",
  "online",
  "website",
  "site",
  "link",
  "url",
  "www",
];

const NAME_KEYWORDS = [
  "ahmed",
  "zulfiqar",
  "khan",
  "ali",
  "sultan",
  "abdullah",
  "muhammad",
  "omar",
  "ibrahim",
  "yusuf",
  "hamza",
  "bilal",
  "farooq",
  "raza",
  "malik",
  "sheikh",
  "ahmad",
  "ahmet",
  "mohammed",
  "mohamed",
  "mohammad",
  "abdul",
  "abd",
  "abdou",
  "abdel",
  "ibn",
  "bin",
  "ben",
  "ibn",
  "ibnu",
  "ibn",
  "ibn",
  "ibn",
  "ibn",
];

const DOMAIN_KEYWORDS = [
  "com",
  "net",
  "org",
  "edu",
  "gov",
  "io",
  "co",
  "uk",
  "ae",
  "qa",
  "pk",
  "info",
  "biz",
  "me",
  "tv",
  "cc",
  "pro",
  "name",
  "xyz",
  "online",
  "site",
  "web",
  "club",
  "store",
  "shop",
  "tech",
  "app",
  "ai",
  "ml",
  "gov",
  "edu",
];

const EMAIL_KEYWORDS = [
  "gmail",
  "yahoo",
  "hotmail",
  "outlook",
  "aol",
  "protonmail",
  "zoho",
  "mail",
  "email",
  "e-mail",
  "inbox",
  "contact",
  "support",
  "info",
  "help",
  "admin",
];

const SOCIAL_KEYWORDS = [
  "whatsapp",
  "wa",
  "telegram",
  "tg",
  "viber",
  "facebook",
  "fb",
  "instagram",
  "ig",
  "linkedin",
  "twitter",
  "x",
  "snapchat",
  "skype",
  "discord",
  "tiktok",
];

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
  "hundred",
  "thousand",
  "million",
  "billion",
  "trillion",
];

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
const ENGLISH_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Common phone number patterns by country
const PHONE_PATTERNS = {
  // Qatar - 8 digits: 333 4444, 555 6666, etc.
  qa: [
    {
      pattern: /(?:\+?974\s*)?(\d{3}\s*\d{4})/g,
      minDigits: 7,
      maxDigits: 8,
      confidence: 95,
    },
    {
      pattern: /(?:\+?974\s*)?(\d{2}\s*\d{3}\s*\d{3})/g,
      minDigits: 8,
      maxDigits: 8,
      confidence: 90,
    },
    {
      pattern: /(?:\+?974\s*)?(\d{4}\s*\d{4})/g,
      minDigits: 8,
      maxDigits: 8,
      confidence: 85,
    },
  ],
  // UAE - 8 or 9 digits depending on emirate
  ae: [
    {
      pattern: /(?:\+?971\s*)?(\d{2}\s*\d{3}\s*\d{4})/g,
      minDigits: 9,
      maxDigits: 9,
      confidence: 95,
    },
    {
      pattern: /(?:\+?971\s*)?(\d{3}\s*\d{3}\s*\d{3})/g,
      minDigits: 9,
      maxDigits: 9,
      confidence: 90,
    },
  ],
  // Saudi Arabia - 9 digits
  sa: [
    {
      pattern: /(?:\+?966\s*)?(\d{2}\s*\d{3}\s*\d{4})/g,
      minDigits: 9,
      maxDigits: 9,
      confidence: 95,
    },
    {
      pattern: /(?:\+?966\s*)?(\d{3}\s*\d{3}\s*\d{3})/g,
      minDigits: 9,
      maxDigits: 9,
      confidence: 90,
    },
  ],
  // Pakistan - varies by city
  pk: [
    {
      pattern: /(?:\+?92\s*)?(\d{2,4}\s*\d{5,7})/g,
      minDigits: 9,
      maxDigits: 11,
      confidence: 95,
    },
    {
      pattern: /(?:\+?92\s*)?(\d{3}\s*\d{7})/g,
      minDigits: 10,
      maxDigits: 10,
      confidence: 90,
    },
  ],
  // Generic international pattern
  global: [
    {
      pattern: /(?:\+?\d{1,4}\s*)?(\d{3,4}\s*\d{3,4}\s*\d{3,4})/g,
      minDigits: 7,
      maxDigits: 15,
      confidence: 85,
    },
    {
      pattern: /(?:\+?\d{1,4}\s*)?(\d{2,3}\s*\d{3,4}\s*\d{4})/g,
      minDigits: 7,
      maxDigits: 12,
      confidence: 80,
    },
    {
      pattern: /(?:\+?\d{1,4}\s*)?(\d{3,4}\s*\d{4})/g,
      minDigits: 7,
      maxDigits: 8,
      confidence: 75,
    },
  ],
};

// Common phone number indicators
const PHONE_INDICATORS = [
  "phone",
  "tel",
  "telephone",
  "mobile",
  "cell",
  "whatsapp",
  "wa",
  "viber",
  "telegram",
  "messenger",
  "contact",
  "reach",
  "call",
  "text",
  "sms",
  "chat",
];

export function detectContactInfo(text: string): ContactDetection[] {
  if (!text || text.trim().length < 3) return [];

  const detections: ContactDetection[] = [];

  // Layer 1: Direct pattern matching with enhanced URL detection
  const directMatches = findDirectMatches(text);
  detections.push(...directMatches);

  // Layer 2: Special space-separated URL detection (for patterns like "website. com")
  const spaceSeparatedMatches = findSpaceSeparatedUrlMatches(text);
  detections.push(...spaceSeparatedMatches);

  // Layer 3: Multi-word pattern detection (for patterns like "ahmed gmail com")
  const multiWordMatches = findMultiWordPatterns(text);
  detections.push(...multiWordMatches);

  // Layer 4: Phone number detection (NEW AND IMPROVED)
  const phoneMatches = findPhoneNumbers(text);
  detections.push(...phoneMatches);

  // Layer 5: Normalized pattern matching
  const normalizedMatches = findNormalizedMatches(text);
  detections.push(...normalizedMatches);

  // Layer 6: Deep pattern matching for obfuscation
  const deepMatches = findDeepMatches(text);
  detections.push(...deepMatches);

  // Layer 7: Contextual analysis
  const contextualDetections = analyzeContext(detections, text);

  // Layer 8: Final confidence scoring
  return calculateConfidence(contextualDetections, text);
}

// ===== LAYER 1: DIRECT PATTERN MATCHING WITH ENHANCED URL DETECTION =====
function findDirectMatches(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // Enhanced URL patterns that specifically target space-separated domains
  const urlPatterns = [
    // Standard URLs
    { regex: /https?:\/\/[^\s<>"'()]+/gi, type: "url", baseConfidence: 95 },

    // www. pattern
    {
      regex: /\bwww\.[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/gi,
      type: "url",
      baseConfidence: 90,
    },

    // Domain patterns without protocol (including space-separated variations)
    {
      regex:
        /\b[a-z0-9-]+\s*\.\s*(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk|info|biz|me|tv|cc|pro|name|xyz|online|site|web|club|store|shop|tech|app|io|ai|ml|co\.uk|com\.pk|net\.pk|org\.pk)\b/gi,
      type: "url",
      baseConfidence: 90,
    },

    // Domain patterns with common words + space-separated TLD (e.g., "website . com")
    {
      regex:
        /\b(?:website|site|online|web|app|service|contact|info)\s*\.\s*(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 85,
    },

    // Domain patterns with common words + space-separated TLD + optional country code (e.g., "website . com . pk")
    {
      regex:
        /\b(?:website|site|online|web|app|service|contact|info)\s*\.\s*(?:com|org|net)\s*\.\s*(?:pk|qa|ae|uk)\b/gi,
      type: "url",
      baseConfidence: 85,
    },

    // Domain patterns with intentional space separation (e.g., "ahmed . com")
    {
      regex:
        /\b[a-z0-9-]+\s*\.\s*(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 85,
    },

    // Domain patterns with intentional space separation and country code (e.g., "ahmed . com . pk")
    {
      regex: /\b[a-z0-9-]+\s*\.\s*(?:com|org|net)\s*\.\s*(?:pk|qa|ae|uk)\b/gi,
      type: "url",
      baseConfidence: 85,
    },

    // Domain patterns with intentional space separation and multiple TLDs (e.g., "ahmed . com . pk")
    {
      regex:
        /\b[a-z0-9-]+\s*\.\s*[a-z0-9-]+\s*\.\s*(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 80,
    },
  ];

  // Process URL patterns
  urlPatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanMatchResult(match, pattern.type);
        if (cleanMatch.length < 3) return;

        if (!isFalsePositive(cleanMatch)) {
          detections.push({
            type: pattern.type as ContactDetection['type'],
            pattern: cleanMatch,
            rawPattern: match,
            severity: "high",
            confidence: pattern.baseConfidence,
            context: getSurroundingContext(text, cleanMatch),
          });
        }
      });
    }
  });

  return detections;
}

// ===== LAYER 2: SPECIAL SPACE-SEPARATED URL DETECTION =====
function findSpaceSeparatedUrlMatches(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // This layer specifically targets patterns like "website. com", "ahmed .com", "contact . com", etc.
  const spaceSeparatedPatterns = [
    // Patterns with space before/after the dot
    {
      regex:
        /\b([a-z0-9-]+)\s*\.\s*(com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 95,
    },

    // Patterns with common words + space-separated TLD
    {
      regex:
        /\b(website|site|online|web|app|service|contact|info)\s*\.\s*(com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 90,
    },

    // Patterns with space-separated multi-level domains
    {
      regex: /\b([a-z0-9-]+)\s*\.\s*(com|org|net)\s*\.\s*(pk|qa|ae|uk)\b/gi,
      type: "url",
      baseConfidence: 90,
    },

    // Patterns with space-separated domains and optional "www"
    {
      regex:
        /\bwww\s*\.\s*([a-z0-9-]+)\s*\.\s*(com|org|net|edu|gov|io|co|uk|ae|qa|pk)\b/gi,
      type: "url",
      baseConfidence: 85,
    },
  ];

  spaceSeparatedPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      // Reconstruct the full match with spaces to preserve the original pattern
      const fullMatch = text.substring(
        match.index,
        match.index + match[0].length
      );
      const cleanMatch = cleanMatchResult(fullMatch, pattern.type);

      if (cleanMatch.length >= 3 && !isFalsePositive(cleanMatch)) {
        detections.push({
          type: pattern.type as ContactDetection['type'],
          pattern: cleanMatch,
          rawPattern: fullMatch,
          severity: "high",
          confidence: pattern.baseConfidence,
          context: getSurroundingContext(text, cleanMatch),
        });
      }

      // Prevent infinite loops
      if (pattern.regex.lastIndex === match.index) {
        pattern.regex.lastIndex++;
      }
    }
  });

  return detections;
}

// ===== LAYER 3: MULTI-WORD PATTERN DETECTION (FOR "ahmed gmail com" PATTERNS) =====
function findMultiWordPatterns(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // Split text into words
  const words = text.split(/\s+/).filter((word) => word.length > 0);

  // Check sequences of words that might form contact information
  for (let i = 0; i < words.length - 2; i++) {
    const word1 = cleanWordForDetection(words[i]);
    const word2 = cleanWordForDetection(words[i + 1]);
    const word3 = cleanWordForDetection(words[i + 2]);

    // Check for email-like patterns: [name] [email-provider] [domain]
    if (
      isNameLike(word1) &&
      EMAIL_KEYWORDS.some((kw) => word2.includes(kw)) &&
      DOMAIN_KEYWORDS.some((kw) => word3.includes(kw))
    ) {
      const pattern = `${word1}@${word2}.${word3}`;
      const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;

      detections.push({
        type: "email",
        pattern,
        rawPattern,
        severity: "high",
        confidence: 85,
        context: getSurroundingWords(words, i, 3),
      });
    }

    // Check for URL-like patterns: [name] [domain] [country-code]
    if (
      isNameLike(word1) &&
      DOMAIN_KEYWORDS.some((kw) => word2.includes(kw)) &&
      ["pk", "qa", "ae", "uk", "us", "ca", "de", "fr"].includes(word3)
    ) {
      const pattern = `${word1}.${word2}.${word3}`;
      const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;

      detections.push({
        type: "url",
        pattern,
        rawPattern,
        severity: "high",
        confidence: 80,
        context: getSurroundingWords(words, i, 3),
      });
    }

    // Check for patterns with "at" or "dot": [name] at [email-provider] dot [domain]
    if (
      i < words.length - 4 &&
      isNameLike(word1) &&
      ["at", "@"].includes(words[i + 1].toLowerCase()) &&
      EMAIL_KEYWORDS.some((kw) => word3.includes(kw)) &&
      ["dot", "."].includes(words[i + 3].toLowerCase()) &&
      DOMAIN_KEYWORDS.some((kw) => word3.includes(kw))
    ) {
      const pattern = `${word1}@${word3}.${word1}`;
      const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${
        words[i + 3]
      } ${words[i + 4]}`;

      detections.push({
        type: "email",
        pattern,
        rawPattern,
        severity: "high",
        confidence: 90,
        context: getSurroundingWords(words, i, 5),
      });
    }

    // Check for patterns with "dot" at the end: [name] [domain] dot [country-code]
    if (
      i < words.length - 3 &&
      isNameLike(word1) &&
      DOMAIN_KEYWORDS.some((kw) => word2.includes(kw)) &&
      ["dot", "."].includes(words[i + 2].toLowerCase()) &&
      ["pk", "qa", "ae", "uk", "us", "ca", "de", "fr"].includes(
        words[i + 3].toLowerCase()
      )
    ) {
      const pattern = `${word1}.${word2}.${words[i + 3]}`;
      const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${
        words[i + 3]
      }`;

      detections.push({
        type: "url",
        pattern,
        rawPattern,
        severity: "high",
        confidence: 85,
        context: getSurroundingWords(words, i, 4),
      });
    }

    // Check for patterns with "at": [name] at [email-provider] [domain]
    if (
      i < words.length - 3 &&
      isNameLike(word1) &&
      ["at", "@"].includes(words[i + 1].toLowerCase()) &&
      EMAIL_KEYWORDS.some((kw) => word3.includes(kw)) &&
      DOMAIN_KEYWORDS.some((kw) => word1.includes(kw))
    ) {
      const pattern = `${word1}@${word3}.${word1}`;
      const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${
        words[i + 3]
      }`;

      detections.push({
        type: "email",
        pattern,
        rawPattern,
        severity: "high",
        confidence: 85,
        context: getSurroundingWords(words, i, 4),
      });
    }

    // Check for social media patterns: [social] [name]
    if (SOCIAL_KEYWORDS.some((kw) => word1.includes(kw)) && isNameLike(word2)) {
      const pattern = `${word1}/${word2}`;
      const rawPattern = `${words[i]} ${words[i + 1]}`;

      detections.push({
        type: "social",
        pattern,
        rawPattern,
        severity: "medium",
        confidence: 75,
        context: getSurroundingWords(words, i, 2),
      });
    }
  }

  // Additional check for 4-word patterns
  for (let i = 0; i < words.length - 3; i++) {
    const word1 = cleanWordForDetection(words[i]);
    const word2 = cleanWordForDetection(words[i + 1]);
    const word3 = cleanWordForDetection(words[i + 2]);
    const word4 = cleanWordForDetection(words[i + 3]);

    // Check for patterns like "my email is ahmed gmail com"
    if (
      CONTACT_KEYWORDS.some((kw) => word1.includes(kw)) &&
      EMAIL_INDICATOR_WORDS.some((kw) => word2.includes(kw)) &&
      isNameLike(word3) &&
      EMAIL_KEYWORDS.some((kw) => word4.includes(kw))
    ) {
      // Look ahead for domain
      if (i + 4 < words.length) {
        const word5 = cleanWordForDetection(words[i + 4]);
        if (DOMAIN_KEYWORDS.some((kw) => word5.includes(kw))) {
          const pattern = `${word3}@${word4}.${word5}`;
          const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${
            words[i + 3]
          } ${words[i + 4]}`;

          detections.push({
            type: "email",
            pattern,
            rawPattern,
            severity: "high",
            confidence: 90,
            context: getSurroundingWords(words, i, 5),
          });
        }
      }
    }

    // Check for patterns like "ahmed at gmail dot com"
    if (
      isNameLike(word1) &&
      ["at", "@"].includes(words[i + 1].toLowerCase()) &&
      EMAIL_KEYWORDS.some((kw) => word3.includes(kw)) &&
      ["dot", "."].includes(words[i + 3].toLowerCase())
    ) {
      // Look ahead for domain
      if (i + 4 < words.length) {
        const word5 = cleanWordForDetection(words[i + 4]);
        if (DOMAIN_KEYWORDS.some((kw) => word5.includes(kw))) {
          const pattern = `${word1}@${word3}.${word5}`;
          const rawPattern = `${words[i]} ${words[i + 1]} ${words[i + 2]} ${
            words[i + 3]
          } ${words[i + 4]}`;

          detections.push({
            type: "email",
            pattern,
            rawPattern,
            severity: "high",
            confidence: 95,
            context: getSurroundingWords(words, i, 5),
          });
        }
      }
    }
  }

  return detections;
}

// ===== LAYER 4: PHONE NUMBER DETECTION (NEW AND IMPROVED) =====
function findPhoneNumbers(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // 1. Direct phone number patterns
  const directPhonePatterns = [
    // International formats with country codes
    {
      regex: /\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
      type: "phone",
      baseConfidence: 95,
    },

    // Middle Eastern formats (Qatar, UAE, etc.)
    {
      regex: /\+?97[0-9][-.\s]?\d{3}[-.\s]?\d{4}/g,
      type: "phone",
      baseConfidence: 95,
    },

    // Common phone number patterns
    {
      regex: /\b(?:\d{3}[-.\s]?){2,3}\d{3,4}\b/g,
      type: "phone",
      baseConfidence: 85,
    },

    // Phone numbers with words
    {
      regex:
        /\b(?:phone|tel|mobile|cell|whatsapp|wa)\s*[:\-]?\s*\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/gi,
      type: "phone",
      baseConfidence: 95,
    },
  ];

  directPhonePatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanPhoneMatch(match);
        if (
          cleanMatch.digits.length >= 7 &&
          !isFalsePositive(cleanMatch.display)
        ) {
          detections.push({
            type: "phone",
            pattern: cleanMatch.display,
            rawPattern: match,
            severity: "high",
            confidence: pattern.baseConfidence,
            context: getSurroundingContext(text, match),
          });
        }
      });
    }
  });

  // 2. Country-specific patterns
  Object.entries(PHONE_PATTERNS).forEach(([country, patterns]) => {
    patterns.forEach((patternConfig) => {
      let match;
      while ((match = patternConfig.pattern.exec(text)) !== null) {
        const rawMatch = text.substring(
          match.index,
          match.index + match[0].length
        );
        const cleanMatch = cleanPhoneMatch(rawMatch);

        if (
          cleanMatch.digits.length >= patternConfig.minDigits &&
          cleanMatch.digits.length <= patternConfig.maxDigits &&
          !isFalsePositive(cleanMatch.display)
        ) {
          detections.push({
            type: "phone",
            pattern: cleanMatch.display,
            rawPattern: rawMatch,
            severity: "high",
            confidence: patternConfig.confidence,
            context: getSurroundingContext(text, rawMatch),
          });
        }
      }
    });
  });

  // 3. Multi-word phone number detection (e.g., "three three three four four four four")
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  for (let i = 0; i < words.length - 3; i++) {
    // Check for patterns like "call me at three three three four four four four"
    if (
      PHONE_INDICATORS.some((indicator) =>
        words
          .slice(Math.max(0, i - 3), i)
          .some((w) => w.toLowerCase().includes(indicator))
      )
    ) {
      const numberWords = [];
      let j = i;

      // Collect up to 10 number words
      while (j < words.length && numberWords.length < 10) {
        const word = words[j].toLowerCase().replace(/[^a-z]/g, "");
        if (NUMBER_WORDS.includes(word)) {
          numberWords.push(word);
        } else {
          break;
        }
        j++;
      }

      if (numberWords.length >= 7) {
        const digits = numberWords
          .map((word) => {
            const index = NUMBER_WORDS.indexOf(word);
            return index < 10 ? index.toString() : "";
          })
          .join("");

        if (digits.length >= 7) {
          const rawPattern = words.slice(i, i + numberWords.length).join(" ");
          detections.push({
            type: "phone",
            pattern: formatPhoneNumber(digits),
            rawPattern: rawPattern,
            severity: "high",
            confidence: 85,
            context: getSurroundingWords(words, i, numberWords.length),
          });
        }
      }
    }
  }

  // 4. Arabic digit detection
  const arabicDigitPattern = new RegExp(`[${ARABIC_DIGITS.join("")}]+`, "g");
  let arabicMatch;
  while ((arabicMatch = arabicDigitPattern.exec(text)) !== null) {
    const arabicDigits = arabicMatch[0];
    const englishDigits = convertArabicToEnglish(arabicDigits);

    if (englishDigits.length >= 7) {
      const rawPattern = text.substring(
        arabicMatch.index,
        arabicMatch.index + arabicMatch[0].length
      );
      detections.push({
        type: "phone",
        pattern: formatPhoneNumber(englishDigits),
        rawPattern: rawPattern,
        severity: "high",
        confidence: 90,
        context: getSurroundingContext(text, rawPattern),
      });
    }
  }

  // 5. Phone numbers with spaces but no separators (e.g., "333 4444")
  const spaceSeparatedNumbers = text.match(/\b(?:\d+\s+){3,}\d+\b/g);
  if (spaceSeparatedNumbers) {
    spaceSeparatedNumbers.forEach((match) => {
      const digits = match.replace(/\D/g, "");
      if (digits.length >= 7 && digits.length <= 15) {
        detections.push({
          type: "phone",
          pattern: formatPhoneNumber(digits),
          rawPattern: match,
          severity: "high",
          confidence: 80,
          context: getSurroundingContext(text, match),
        });
      }
    });
  }

  // 6. Phone numbers with repeated patterns (e.g., "3333333")
  const repeatedPatterns = text.match(/\b(\d)\1{5,}\b/g);
  if (repeatedPatterns) {
    repeatedPatterns.forEach((match) => {
      detections.push({
        type: "phone",
        pattern: formatPhoneNumber(match),
        rawPattern: match,
        severity: "medium",
        confidence: 70,
        context: getSurroundingContext(text, match),
      });
    });
  }

  return detections;
}

// ===== HELPER FUNCTIONS FOR PHONE NUMBER DETECTION =====
function cleanPhoneMatch(match: string): { digits: string; display: string } {
  // Extract digits
  const digits = match.replace(/\D/g, "");

  // Format for display (Qatar example: 333 4444)
  let display = "";
  if (digits.length === 8) {
    display = `${digits.substring(0, 3)} ${digits.substring(3)}`;
  } else if (digits.length === 9) {
    display = `${digits.substring(0, 2)} ${digits.substring(
      2,
      5
    )} ${digits.substring(5)}`;
  } else if (digits.length === 10) {
    display = `+${digits.substring(0, 2)} ${digits.substring(
      2,
      5
    )} ${digits.substring(5, 8)} ${digits.substring(8)}`;
  } else {
    // For other lengths, group in sets of 3-4 digits
    for (let i = 0; i < digits.length; i += 3) {
      display += digits.substring(i, i + 3) + " ";
    }
    display = display.trim();
  }

  return { digits, display };
}

function formatPhoneNumber(digits: string): string {
  if (digits.length === 8) {
    return `${digits.substring(0, 3)} ${digits.substring(3)}`;
  } else if (digits.length === 9) {
    return `${digits.substring(0, 2)} ${digits.substring(
      2,
      5
    )} ${digits.substring(5)}`;
  } else if (digits.length === 10) {
    return `+${digits.substring(0, 2)} ${digits.substring(
      2,
      5
    )} ${digits.substring(5, 8)} ${digits.substring(8)}`;
  } else {
    // For other lengths, group in sets of 3-4 digits
    let formatted = "";
    for (let i = 0; i < digits.length; i += 3) {
      formatted += digits.substring(i, i + 3) + " ";
    }
    return formatted.trim();
  }
}

function convertArabicToEnglish(arabicDigits: string): string {
  return arabicDigits
    .split("")
    .map((digit) => {
      const index = ARABIC_DIGITS.indexOf(digit);
      return index !== -1 ? ENGLISH_DIGITS[index] : digit;
    })
    .join("");
}

// ===== LAYER 5: NORMALIZED PATTERN MATCHING =====
function findNormalizedMatches(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // URL patterns for normalized text
  const normalizedUrlPatterns = [
    // Domain patterns without separators (e.g., ahmedcom)
    {
      regex: /[a-z0-9]+(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)[a-z0-9]*/gi,
      type: "url",
      baseConfidence: 75,
    },

    // Domain patterns with common misspellings (e.g., ahmedcompk)
    {
      regex: /[a-z0-9]+(?:com|org|net)(?:pk|qa|ae|uk)[a-z0-9]*/gi,
      type: "url",
      baseConfidence: 70,
    },

    // Common word + TLD patterns without separators (e.g., websitecom)
    {
      regex:
        /(?:website|site|online|web|app|service|contact|info)(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)[a-z0-9]*/gi,
      type: "url",
      baseConfidence: 80,
    },
  ];

  // Email patterns for normalized text
  const normalizedEmailPatterns = [
    // Email without separators (e.g., ahmedgmailcom)
    {
      regex:
        /[a-z0-9]+(?:gmail|yahoo|hotmail|outlook|aol|protonmail|zoho)[a-z0-9]*com[a-z0-9]*/gi,
      type: "email",
      baseConfidence: 80,
    },

    // Email with common misspellings
    {
      regex:
        /[a-z0-9]+(?:gmai|yah00|hotma1|outl00k|a0l|pr0t0nm4il|z0h0)[a-z0-9]*c0m[a-z0-9]*/gi,
      type: "obfuscated",
      baseConfidence: 75,
    },
  ];

  normalizedUrlPatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanMatchResult(match, pattern.type);
        if (cleanMatch.length >= 3 && !isFalsePositive(cleanMatch)) {
          detections.push({
            type: pattern.type as ContactDetection['type'],
            pattern: cleanMatch,
            severity: "medium",
            confidence: pattern.baseConfidence,
            context: "normalized",
          });
        }
      });
    }
  });

  normalizedEmailPatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanMatchResult(match, pattern.type);
        if (cleanMatch.length >= 3 && !isFalsePositive(cleanMatch)) {
          detections.push({
            type: pattern.type as ContactDetection['type'],
            pattern: cleanMatch,
            severity: "medium",
            confidence: pattern.baseConfidence,
            context: "normalized",
          });
        }
      });
    }
  });

  return detections;
}

// ===== LAYER 6: DEEP PATTERN MATCHING FOR OBFUSCATION =====
function findDeepMatches(text: string): ContactDetection[] {
  const detections: ContactDetection[] = [];

  // Deep URL patterns
  const deepUrlPatterns = [
    // Domain patterns with character substitution (e.g., ahmedc0m)
    {
      regex: /[a-z0-9]+(?:c0m|0rg|n3t|3du|g0v|10|c0|uk|a3|q4|pk)[a-z0-9]*/gi,
      type: "obfuscated",
      baseConfidence: 80,
    },

    // Domain patterns with repeated characters (e.g., aahmeedcom)
    {
      regex:
        /(.)\1{2,}[a-z0-9]+(?:com|org|net|edu|gov|io|co|uk|ae|qa|pk)[a-z0-9]*/gi,
      type: "obfuscated",
      baseConfidence: 75,
    },

    // Common word + TLD patterns with character substitution
    {
      regex:
        /(?:webs1te|s1te|onl1ne|w3b|4pp|s3rv1ce|c0nt4ct|1nfo)(?:c0m|0rg|n3t|3du|g0v|10|c0|uk|a3|q4|pk)[a-z0-9]*/gi,
      type: "obfuscated",
      baseConfidence: 85,
    },
  ];

  // Deep email patterns
  const deepEmailPatterns = [
    // Email with character substitution (e.g., ahmed@gma1l.c0m)
    {
      regex:
        /[a-z0-9]+@(?:gma1l|yah00|hotma1|outl00k|a0l|pr0t0nm4il|z0h0)\.(?:c0m|0rg|n3t|3du|g0v|10|c0|uk|a3|q4|pk)/gi,
      type: "obfuscated",
      baseConfidence: 85,
    },
  ];

  deepUrlPatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanMatchResult(match, pattern.type);
        if (cleanMatch.length >= 3 && !isFalsePositive(cleanMatch)) {
          detections.push({
            type: pattern.type as ContactDetection['type'],
            pattern: cleanMatch,
            severity: "high",
            confidence: pattern.baseConfidence,
            context: "deep_normalized",
          });
        }
      });
    }
  });

  deepEmailPatterns.forEach((pattern) => {
    const matches = findMatches(text, pattern.regex);
    if (matches) {
      matches.forEach((match) => {
        const cleanMatch = cleanMatchResult(match, pattern.type);
        if (cleanMatch.length >= 3 && !isFalsePositive(cleanMatch)) {
          detections.push({
            type: pattern.type as ContactDetection['type'],
            pattern: cleanMatch,
            severity: "high",
            confidence: pattern.baseConfidence,
            context: "deep_normalized",
          });
        }
      });
    }
  });

  return detections;
}

// ===== HELPER FUNCTIONS FOR MULTI-WORD DETECTION =====
function cleanWordForDetection(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/1/g, "i")
    .replace(/0/g, "o")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/3/g, "e")
    .replace(/8/g, "b")
    .replace(/4/g, "a")
    .replace(/6/g, "g")
    .replace(/9/g, "q")
    .replace(/l/g, "i")
    .replace(/z/g, "s");
}

function isNameLike(word: string): boolean {
  // Check if it looks like a name (at least 3 characters, mostly letters)
  return (
    word.length >= 3 &&
    /[a-z]/i.test(word) &&
    word.match(/[a-z]/gi)?.length! > word.length * 0.7
  );
}

function getSurroundingWords(
  words: string[],
  startIndex: number,
  length: number
): string {
  const start = Math.max(0, startIndex - 2);
  const end = Math.min(words.length, startIndex + length + 2);
  return words.slice(start, end).join(" ");
}

// ===== UTILITY FUNCTIONS =====
function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[\s\-_.,:;|\/\\~`!@#$%^&*()+=\[\]{}'"<>?]/g, "")
    .replace(/\b(dot|d0t|d-o-t|dt|d0t|d0tt|dott|d0tt|dott)\b/g, ".")
    .replace(/\b(at|a-t|a_t|att|at|@|a@t|a@tt|a@t)\b/g, "@")
    .replace(/\b(zero|o|oh|0h|00|0o|oo)\b/g, "0")
    .replace(/\bone\b/g, "1")
    .replace(/\btwo\b/g, "2")
    .replace(/\bthree\b/g, "3")
    .replace(/\bfour\b/g, "4")
    .replace(/\bfive\b/g, "5")
    .replace(/\bsix\b/g, "6")
    .replace(/\bseven\b/g, "7")
    .replace(/\beight\b/g, "8")
    .replace(/\bnine\b/g, "9")
    .replace(/\bcom\b/g, "com")
    .replace(/\bn?t\b/g, "net")
    .replace(/\borg\b/g, "org")
    .replace(/\bedu\b/g, "edu")
    .replace(/\bgov\b/g, "gov")
    .replace(/\bio\b/g, "io")
    .replace(/\bco\b/g, "co")
    .replace(/\buk\b/g, "uk")
    .replace(/\bae\b/g, "ae")
    .replace(/\bqa\b/g, "qa")
    .replace(/\bpk\b/g, "pk");
}

function findMatches(text: string, regex: RegExp): string[] {
  const matches = [];
  let match;

  // Reset regex lastIndex to avoid issues with global regex
  regex.lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);

    // Prevent infinite loops
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  return matches;
}

function cleanMatchResult(match: string, type: string): string {
  // Remove common surrounding characters
  let clean = match
    .trim()
    .replace(/^[.,;:!?(){}\[\]'"`]+|[.,;:!?(){}\[\]'"`]+$/g, "");

  // Special cleaning for URLs
  if (type === "url" || type === "obfuscated") {
    clean = clean
      .replace(/^(https?:\/\/)?(www\.)?/i, "")
      .replace(/\/$/, "")
      .replace(/\s+/g, "");
  }

  return clean;
}

function isFalsePositive(pattern: string): boolean {
  return FALSE_POSITIVES.some(
    (fp) =>
      pattern.toLowerCase().includes(fp.toLowerCase()) ||
      levenshteinDistance(pattern.toLowerCase(), fp.toLowerCase()) < 3
  );
}

function getSurroundingContext(text: string, pattern: string): string {
  const index = text.toLowerCase().indexOf(pattern.toLowerCase());
  if (index === -1) return "";

  const start = Math.max(0, index - 20);
  const end = Math.min(text.length, index + pattern.length + 20);

  return text.substring(start, end).trim();
}

function analyzeContext(
  detections: ContactDetection[],
  text: string
): ContactDetection[] {
  return detections.map((detection) => {
    let confidence = detection.confidence;

    // Check for context clues
    const contextLower = detection.context?.toLowerCase() || "";
    const contextClues = CONTEXT_CLUES.filter((clue) =>
      contextLower.includes(clue.toLowerCase())
    ).length;

    confidence += Math.min(20, contextClues * 3);

    // Boost confidence for common words + TLD patterns
    const commonWordPattern = new RegExp(
      `\\b(${COMMON_WORDS_FOR_DOMAINS.join(
        "|"
      )})\\s*\\.\\s*(com|org|net|edu|gov|io|co|uk|ae|qa|pk)\\b`,
      "i"
    );
    if (commonWordPattern.test(detection.pattern)) {
      confidence += 15;
    }

    // Boost confidence if it's a complete URL or email
    if (
      detection.type === "url" &&
      detection.pattern.includes(".") &&
      !detection.pattern.startsWith("www.") &&
      !detection.pattern.endsWith(".")
    ) {
      confidence += 10;
    }

    // Boost confidence for patterns that include common name keywords
    if (
      NAME_KEYWORDS.some((kw) => detection.pattern.toLowerCase().includes(kw))
    ) {
      confidence += 10;
    }

    // Boost confidence for phone numbers with context clues
    if (
      detection.type === "phone" &&
      PHONE_INDICATORS.some((indicator) => contextLower.includes(indicator))
    ) {
      confidence += 15;
    }

    return {
      ...detection,
      confidence,
    };
  });
}

function calculateConfidence(
  detections: ContactDetection[],
  text: string
): ContactDetection[] {
  return detections
    .map((detection) => {
      // Adjust severity based on confidence
      const severity: ContactDetection["severity"] =
        detection.confidence >= 85
          ? "high"
          : detection.confidence >= 65
          ? "medium"
          : "low";

      return {
        ...detection,
        severity,
      };
    })
    .filter((d) => d.confidence >= 55); // Filter out low confidence detections
}

// ===== UTILITY: LEVENSHTEIN DISTANCE FOR SIMILARITY CHECKING =====
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
