// add-t-functions.js
const fs = require("fs");
const path = require("path");

class TFunctionAdder {
  constructor(translationsPath = "./locales/en") {
    this.existingTranslations = this.loadTranslations(translationsPath);
    this.translationValues = Object.values(this.existingTranslations);
    this.changedFiles = [];
    this.addedTranslations = 0;
    this.errors = [];
  }

  loadTranslations(translationsPath) {
    const translations = {};

    try {
      if (!fs.existsSync(translationsPath)) {
        console.log(`⚠️  Translations path ${translationsPath} does not exist`);
        return translations;
      }

      const files = fs.readdirSync(translationsPath);
      files.forEach((file) => {
        if (file.endsWith(".json")) {
          try {
            const filePath = path.join(translationsPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
            Object.assign(translations, content);
          } catch (parseError) {
            console.log(`⚠️  Could not parse ${file}: ${parseError.message}`);
          }
        }
      });

      console.log(
        `📚 Loaded ${Object.keys(translations).length} existing translations`
      );
    } catch (error) {
      console.log(
        `⚠️  Could not load translations from ${translationsPath}: ${error.message}`
      );
    }

    return translations;
  }

  // Find the translation key for a given text value
  findKeyForText(text) {
    if (!text || typeof text !== "string") return null;

    const cleanText = text.trim();
    if (!cleanText) return null;

    // First try exact match
    for (const [key, value] of Object.entries(this.existingTranslations)) {
      if (value === cleanText) return key;
    }

    // Try case-insensitive match
    const lowerText = cleanText.toLowerCase();
    for (const [key, value] of Object.entries(this.existingTranslations)) {
      if (typeof value === "string" && value.toLowerCase() === lowerText)
        return key;
    }

    // Try partial match with stricter criteria
    for (const [key, value] of Object.entries(this.existingTranslations)) {
      if (typeof value === "string") {
        const similarity = this.calculateSimilarity(cleanText, value);
        if (similarity > 0.9) return key;
      }
    }

    return null;
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / parseFloat(longer.length);
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, "utf8");
      let modified = false;
      let hasUseTranslation = content.includes("useTranslation");
      let hasTranslationImport = this.hasTranslationImport(content);

      // Skip files that already use translations heavily
      const tCallCount = (content.match(/\bt\(/g) || []).length;
      if (tCallCount > 5) {
        console.log(
          `⏭️  Skipping ${path.relative(
            process.cwd(),
            filePath
          )} (already has ${tCallCount} t() calls)`
        );
        return;
      }

      console.log(`🔍 Processing: ${path.relative(process.cwd(), filePath)}`);

      const replacements = this.getReplacementPatterns();
      let newContent = content;

      // Apply all replacements
      replacements.forEach(({ name, pattern, replacement }) => {
        const beforeCount = this.addedTranslations;
        newContent = newContent.replace(pattern, (match, ...args) => {
          try {
            return replacement(match, ...args);
          } catch (error) {
            console.log(`⚠️  Error in ${name} replacement: ${error.message}`);
            return match;
          }
        });

        const added = this.addedTranslations - beforeCount;
        if (added > 0) {
          console.log(`  📝 ${name}: ${added} replacements`);
          modified = true;
        }
      });

      // Add necessary imports and hooks if we made changes
      if (modified) {
        newContent = this.addTranslationImports(
          newContent,
          filePath,
          hasTranslationImport
        );
        newContent = this.addTranslationHook(newContent, hasUseTranslation);

        // Write the modified file
        fs.writeFileSync(filePath, newContent);
        this.changedFiles.push(filePath);
        console.log(`  💾 Saved changes to file\n`);
      } else {
        console.log(`  ⏭️  No changes needed\n`);
      }
    } catch (error) {
      const errorMsg = `Error processing ${filePath}: ${error.message}`;
      console.log(`❌ ${errorMsg}`);
      this.errors.push(errorMsg);
    }
  }

  hasTranslationImport(content) {
    const importPatterns = [
      /from\s+['"]\.\.\/lib\/hooks\/useTranslation['"]/,
      /from\s+['"]\.\.\/\.\.\/lib\/hooks\/useTranslation['"]/,
      /from\s+['"]@\/lib\/hooks\/useTranslation['"]/,
      /from\s+['"][^'"]*useTranslation['"]/,
    ];

    return importPatterns.some((pattern) => pattern.test(content));
  }

  getReplacementPatterns() {
    return [
      // JSX text content: >Hello World< becomes >{t('hello_world')}<
      {
        name: "JSX Text Content",
        pattern: />(\s*)([A-Za-z][^<>{}]*[A-Za-z.!?])(\s*)</g,
        replacement: (match, space1, text, space2) => {
          const cleanText = text.trim();
          if (this.isTranslatableText(cleanText)) {
            const key = this.findKeyForText(cleanText);
            if (key) {
              this.addedTranslations++;
              console.log(`  ✅ JSX: "${cleanText}" → t('${key}')`);
              return `>${space1}{t('${key}')}${space2}<`;
            }
          }
          return match;
        },
      },

      // String in quotes for specific attributes
      {
        name: "Quoted Strings in JSX attributes",
        pattern: /(\w+\s*=\s*)["']([^"']+)["']/g,
        replacement: (match, attr, text) => {
          const attrName = attr.trim().replace(/\s*=\s*$/, "");
          const allowedAttrs = [
            "placeholder",
            "title",
            "alt",
            "aria-label",
            "aria-description",
            "tooltip",
            "label",
          ];

          if (
            allowedAttrs.includes(attrName) &&
            this.isTranslatableText(text)
          ) {
            const key = this.findKeyForText(text);
            if (key) {
              this.addedTranslations++;
              console.log(
                `  ✅ Attr: ${attrName}="${text}" → ${attrName}={t('${key}')}`
              );
              return `${attr}{t('${key}')}`;
            }
          }
          return match;
        },
      },

      // Button text and similar elements
      {
        name: "Element Text Content",
        pattern:
          /(<(?:button|span|p|h[1-6]|div|label|li|td|th|a)\b[^>]*>)([^<>{}\n]+)(<\/)/g,
        replacement: (match, openTag, text, closeTag) => {
          const cleanText = text.trim();

          // Skip if it's likely a className or technical content
          if (
            this.isTranslatableText(cleanText) &&
            !this.looksLikeTechnicalContent(openTag, cleanText)
          ) {
            const key = this.findKeyForText(cleanText);
            if (key) {
              this.addedTranslations++;
              console.log(`  ✅ Element: "${cleanText}" → t('${key}')`);
              return `${openTag}{t('${key}')}${closeTag}`;
            }
          }
          return match;
        },
      },
    ];
  }

  looksLikeTechnicalContent(openTag, text) {
    // Check if the element has className suggesting it's not user-facing text
    const hasNonUserFacingClass =
      /className\s*=\s*["'][^"']*(?:hidden|sr-only|visually-hidden|debug|code|technical)/.test(
        openTag
      );

    // Check if text looks like code
    const looksLikeCode = /^[a-z-]+$/.test(text) && text.length < 20;

    return hasNonUserFacingClass || looksLikeCode;
  }

  addTranslationImports(content, filePath, hasTranslationImport) {
    if (hasTranslationImport) return content;

    // Determine the correct import path
    const relativePath = path.relative(
      path.dirname(filePath),
      "./lib/hooks/useTranslation"
    );
    const importPath = relativePath.startsWith(".")
      ? relativePath
      : `./${relativePath}`;

    // Find the last import and add ours after it
    const importRegex = /^(import.*?from.*?['"][^'"]*['"];?\s*\n)/gm;
    const matches = [...content.matchAll(importRegex)];

    if (matches.length > 0) {
      const lastImport = matches[matches.length - 1];
      const importStatement = `import { useTranslation } from '${importPath}';\n`;
      return content.replace(lastImport[0], lastImport[0] + importStatement);
    } else {
      // No imports found, add at the top after potential 'use client' directive
      const useClientMatch = content.match(/^(['"]use client['"];?\s*\n)/);
      if (useClientMatch) {
        const importStatement = `import { useTranslation } from '${importPath}';\n\n`;
        return content.replace(
          useClientMatch[0],
          useClientMatch[0] + importStatement
        );
      } else {
        const importStatement = `import { useTranslation } from '${importPath}';\n\n`;
        return importStatement + content;
      }
    }
  }

  addTranslationHook(content, hasUseTranslation) {
    if (hasUseTranslation) return content;

    // Find function component declaration and add hook
    const patterns = [
      // export default function ComponentName
      /(export\s+default\s+function\s+\w+[^{]*\{)(\s*)/,
      // const ComponentName = () => {
      /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)(\s*)/,
      // function ComponentName() {
      /(function\s+\w+[^{]*\{)(\s*)/,
      // export function ComponentName() {
      /(export\s+function\s+\w+[^{]*\{)(\s*)/,
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        const hookStatement = "  const { t } = useTranslation();\n";
        return content.replace(pattern, `$1$2${hookStatement}$2`);
      }
    }

    return content;
  }

  isTranslatableText(text) {
    if (!text || typeof text !== "string") return false;

    const cleanText = text.trim();
    if (cleanText.length < 2 || cleanText.length > 200) return false;

    // Must contain at least one letter
    if (!/[a-zA-Z]/.test(cleanText)) return false;

    // Skip patterns that indicate non-translatable content
    const skipPatterns = [
      /^[A-Z_][A-Z0-9_]*$/, // CONSTANTS
      /^[a-z]+[A-Z]/, // camelCase variables
      /^\d+$/, // pure numbers
      /^https?:\/\//, // URLs
      /^\//, // file paths
      /^\w+\(/, // function calls
      /^#[0-9a-fA-F]{3,6}$/, // hex colors
      /^rgb\(/, // CSS colors
      /^[a-z-]+$/, // CSS class names (kebab-case)
      /^\$\{/, // template literals
      /^{{/, // template syntax
      /^\w+@\w+/, // email addresses
      /^[0-9.]+[a-z]+$/i, // measurements (10px, 2rem, etc)
      /^[{}[\]()]+$/, // brackets/braces only
      /^[^\w\s]+$/, // special characters only
      /console\.|window\.|document\./, // JavaScript APIs
    ];

    return !skipPatterns.some((pattern) => pattern.test(cleanText));
  }

  scanDirectory(dir) {
    if (!fs.existsSync(dir)) {
      console.log(`⚠️  Directory ${dir} does not exist`);
      return;
    }

    try {
      const files = fs.readdirSync(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
          // Skip certain directories
          const skipDirs = [
            "node_modules",
            ".next",
            ".git",
            "dist",
            "build",
            "coverage",
            "__tests__",
          ];
          if (skipDirs.includes(file.name)) {
            continue;
          }
          this.scanDirectory(fullPath);
        } else if (file.isFile()) {
          // Process TypeScript/JavaScript React files
          if (
            /\.(tsx?|jsx?)$/.test(file.name) &&
            !file.name.includes(".test.") &&
            !file.name.includes(".spec.")
          ) {
            this.processFile(fullPath);
          }
        }
      }
    } catch (error) {
      const errorMsg = `Error scanning directory ${dir}: ${error.message}`;
      console.log(`❌ ${errorMsg}`);
      this.errors.push(errorMsg);
    }
  }

  run(directories = ["./app", "./components"]) {
    console.log("🚀 Starting t() function injection...\n");
    console.log(`📂 Scanning directories: ${directories.join(", ")}`);
    console.log(
      `🔤 Using translations with ${
        Object.keys(this.existingTranslations).length
      } keys\n`
    );

    // Validate directories exist
    const validDirectories = directories.filter((dir) => {
      if (fs.existsSync(dir)) {
        return true;
      } else {
        console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
        return false;
      }
    });

    if (validDirectories.length === 0) {
      console.log("❌ No valid directories to process!");
      return;
    }

    // Process each directory
    validDirectories.forEach((dir) => {
      console.log(`\n📁 Processing directory: ${dir}`);
      this.scanDirectory(dir);
    });

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 SUMMARY:");
    console.log(`   Files modified: ${this.changedFiles.length}`);
    console.log(`   t() calls added: ${this.addedTranslations}`);
    console.log(
      `   Translation keys available: ${
        Object.keys(this.existingTranslations).length
      }`
    );
    console.log(`   Errors encountered: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log("\n❌ Errors:");
      this.errors.forEach((error) => console.log(`   - ${error}`));
    }

    if (this.changedFiles.length > 0) {
      console.log("\n📝 Modified files:");
      this.changedFiles.forEach((file) => {
        console.log(`   - ${path.relative(process.cwd(), file)}`);
      });
    }

    console.log(
      "\n✅ Done! Your code now uses t() functions for internationalization."
    );
    console.log(
      "🧪 Test your app with language switching to make sure everything works!"
    );

    if (this.addedTranslations === 0 && this.changedFiles.length === 0) {
      console.log(
        "\n💡 Tip: Make sure your translation files contain the text you want to replace!"
      );
    }
  }
}

// Configuration - adjust these paths for your project
const CONFIG = {
  translationsPath: "./locales/en", // Path to your English translations
  scanDirectories: ["./app", "./components"], // Directories to scan
  // Add more directories if needed: ['./app', './components', './lib', './pages']
};

// Run the script
if (require.main === module) {
  console.log("🌐 T() Function Auto-Injector for Next.js");
  console.log("==========================================\n");

  const injector = new TFunctionAdder(CONFIG.translationsPath);
  injector.run(CONFIG.scanDirectories);
}

module.exports = TFunctionAdder;
