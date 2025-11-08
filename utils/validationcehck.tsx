"use client";
export const VALIDATION_RULES = {
  title: { min: 10, max: 50 },
  description: { min: 20, max: 5000 },
  estimatedBudget: { min: 0, max: 5000000 },
  location: { min: 1, max: 100 },
  maxFileSize: 5 * 1024 * 1024,
};
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
  context?: string;
  rawPattern?: string;
}

/* ────────────────────────────────────────────────────────────── */
/*  FALSE POSITIVES & CONTEXT CLUES (unchanged)                  */
/* ────────────────────────────────────────────────────────────── */
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
  "reply@",
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
  "chat",
  "reach",
  "call",
  "text",
  "message",
  "connect",
  "follow",
  "website",
  "site",
  "link",
  "url",
  "www",
  "dm",
  "inbox",
  "pm",
];

/* ────────────────────────────────────────────────────────────── */
/*  CORE REGEX PATTERNS – ONE SOURCE OF TRUTH                    */
/* ────────────────────────────────────────────────────────────── */
const PATTERNS = {
  /* ---------- EMAIL ---------- */
  email: /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi,

  /* ---------- OBFUSCATED EMAIL ---------- */
  obfuscatedEmail: [
    // ahmed [at] gmail [dot] com  →  ahmed@gmail.com
    /\b([a-z0-9_-]+)\s*(?:at|@|[\[\(]at[\]\)])\s*([a-z0-9_-]+)\s*(?:dot|\.|[\[\(]dot[\]\)])\s*([a-z]{2,})\b/gi,
    // ahmed gmail com  →  ahmed@gmail.com
    /\b([a-z0-9_-]+)\s+([a-z0-9_-]+)\s+(com|net|org|io|co|ae|qa|pk)\b/gi,
    // ahmedgmailcom (no separator)
    /\b([a-z0-9_-]+)(gmail|yahoo|hotmail|outlook|protonmail|zoho)(com|net|org)\b/gi,
  ],

  /* ---------- PHONE ---------- */
  phone: [
    // International / generic
    /(?:\+?(\d{1,4})[\s.-]?)?\(?(\d{1,4})\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g,
    // Middle-East country codes
    /(?:\+?(?:974|971|966|92))[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g,
    // Simple spaced: 333 4444
    /\b\d{3}\s+\d{4,7}\b/g,
    // Arabic digits (7-15)
    /[\u0660-\u0669]{7,15}/g,
    // Repeated digits (e.g. 3333333)
    /\b(\d)\1{5,}\b/g,
  ],

  /* ---------- URL ---------- */
  url: [
    // http(s)://…
    /https?:\/\/[^\s<>"']+/gi,
    // www.example.com
    /\bwww\.[a-z0-9-]+\.[a-z]{2,}\b/gi,
    // example . com  /  example.com.pk
    /\b([a-z0-9-]+\s*\.\s*(?:com|org|net|io|co|ae|qa|pk))(?:\s*\.\s*[a-z]{2})?\b/gi,
    // website . com
    /\b(?:website|site|web|app|service)\s*\.\s*(com|org|net|io|co|ae|qa|pk)\b/gi,
  ],

  /* ---------- SOCIAL ---------- */
  social: [
    // platform:handle  or  @handle
    /\b(whatsapp|wa|telegram|tg|instagram|ig|facebook|fb|twitter|x|linkedin|snapchat|skype|discord|tiktok)[:\s]*@?([a-z0-9_]{3,})\b/gi,
    // /@handle  or  just @handle
    /\/@?([a-z0-9_]{3,})\b/gi,
  ],
};

/* ────────────────────────────────────────────────────────────── */
/*  MAIN DETECTION FUNCTION                                      */
/* ────────────────────────────────────────────────────────────── */
export function detectContactInfo(text: string): ContactDetection[] {
  if (!text || text.trim().length < 3) return [];

  const detections: ContactDetection[] = [];
  const lower = text.toLowerCase();

  const add = (
    type: ContactDetection["type"],
    pattern: string,
    raw: string,
    baseSeverity: "high" | "medium" | "low" = "low"
  ) => {
    if (isFalsePositive(pattern)) return;
    const ctx = getContext(text, raw);
    const severity = hasContextClue(ctx) ? "high" : baseSeverity;
    detections.push({
      type,
      pattern: pattern.trim(),
      rawPattern: raw,
      severity,
      context: ctx,
    });
  };

  /* ---------- 1. EMAIL ---------- */
  const emailMatches = [...text.matchAll(PATTERNS.email)];
  emailMatches.forEach((m) => add("email", m[0], m[0]));

  /* ---------- 2. OBFUSCATED EMAIL ---------- */
  PATTERNS.obfuscatedEmail.forEach((re) => {
    const matches = [...text.matchAll(re)];
    matches.forEach((m) => {
      const [_, p1, p2, p3] = m;
      const reconstructed = `${p1}@${p2}.${p3}`;
      add("obfuscated", reconstructed, m[0], "medium");
    });
  });

  /* ---------- 3. PHONE ---------- */
  PATTERNS.phone.forEach((re) => {
    const matches = [...text.matchAll(re)];
    matches.forEach((m) => {
      const raw = m[0];
      const digits = raw.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) return;
      const display = formatPhone(digits);
      add("phone", display, raw);
    });
  });

  /* ---------- 4. URL ---------- */
  PATTERNS.url.forEach((re) => {
    const matches = [...text.matchAll(re)];
    matches.forEach((m) => {
      const raw = m[0];
      const clean = raw
        .replace(/^(https?:\/\/|www\.)/i, "")
        .replace(/\s+/g, "");
      add("url", clean, raw);
    });
  });

  /* ---------- 5. SOCIAL ---------- */
  PATTERNS.social.forEach((re) => {
    const matches = [...text.matchAll(re)];
    matches.forEach((m) => {
      const platform = m[1] ? m[1].toLowerCase() : "";
      const handle = m[2] || m[1];
      const pattern = platform ? `${platform}:${handle}` : `@${handle}`;
      add("social", pattern, m[0], "medium");
    });
  });

  /* ---------- 6. ARABIC DIGITS (standalone) ---------- */
  const arabic = text.match(/[\u0660-\u0669]{7,}/g);
  if (arabic) {
    arabic.forEach((raw) => {
      const eng = raw
        .split("")
        .map((d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
        .join("");
      add("arabic", formatPhone(eng), raw, "medium");
    });
  }

  /* ---------- 7. USERNAME FALLBACK (name + provider) ---------- */
  const words = text.split(/\s+/);
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].toLowerCase().replace(/[^\w]/g, "");
    const w2 = words[i + 1].toLowerCase();
    if (
      w1.length > 2 &&
      /[a-z]/.test(w1) &&
      (w2.includes("gmail") ||
        w2.includes("yahoo") ||
        w2.includes("hotmail") ||
        w2.includes("outlook") ||
        w2.includes("com") ||
        w2.includes("pk"))
    ) {
      add("username", `${w1}@${w2}`, `${words[i]} ${words[i + 1]}`, "low");
    }
  }

  /* ---------- DEDUPLICATE ---------- */
  const seen = new Set<string>();
  return detections.filter((d) => {
    const key = `${d.type}:${d.pattern}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ────────────────────────────────────────────────────────────── */
/*  HELPERS                                                      */
/* ────────────────────────────────────────────────────────────── */
function isFalsePositive(p: string): boolean {
  const low = p.toLowerCase();
  return FALSE_POSITIVES.some(
    (fp) => low.includes(fp) || levenshtein(low, fp) <= 2
  );
}

function hasContextClue(ctx: string): boolean {
  const low = ctx.toLowerCase();
  return CONTEXT_CLUES.some((c) => low.includes(c));
}

function getContext(full: string, match: string): string {
  const idx = full.toLowerCase().indexOf(match.toLowerCase());
  if (idx === -1) return "";
  return full.slice(Math.max(0, idx - 35), idx + match.length + 35);
}

function formatPhone(d: string): string {
  if (d.length === 8) return `${d.slice(0, 3)} ${d.slice(3)}`;
  if (d.length === 9) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
  if (d.length >= 10)
    return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(
      8,
      11
    )}`;
  return d.replace(/(\d{3})(\d+)/, "$1 $2");
}

function levenshtein(a: string, b: string): number {
  const m: number[][] = [];
  for (let i = 0; i <= b.length; i++) m[i] = [i];
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      m[i][j] =
        a[j - 1] === b[i - 1]
          ? m[i - 1][j - 1]
          : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1;
    }
  }
  return m[b.length][a.length];
}
