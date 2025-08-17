const fs = require('fs');
const path = require('path');

module.exports = {
  input: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    // Add other directories as needed
  ],
  output: './',
  options: {
    debug: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    lngs: ['en', 'ar'],
    ns: ['common'],
    defaultLng: 'en',
    defaultNs: 'common',
    defaultValue: '__STRING_NOT_TRANSLATED__',
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  },
  transform: function customTransform(file, enc, done) {
    "use strict";
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    let count = 0;

    console.log(`🔍 Scanning: ${file.relative}`);

    // Custom regex patterns to find English text
    const patterns = [
      // String literals in JSX content
      {
        name: 'JSX Content',
        regex: />(\s*)([A-Za-z][^<>{}\n]*[A-Za-z])(\s*)</g,
        extract: (match) => match[2].trim()
      },
      // String literals in quotes (general)
      {
        name: 'Quoted Strings',
        regex: /['"`]([A-Za-z][^'"`\n]*[A-Za-z])['"`]/g,
        extract: (match) => match[1].trim()
      },
      // Placeholder text
      {
        name: 'Placeholder',
        regex: /placeholder\s*=\s*['"`]([^'"`\n]+)['"`]/g,
        extract: (match) => match[1].trim()
      },
      // Title attributes
      {
        name: 'Title',
        regex: /title\s*=\s*['"`]([^'"`\n]+)['"`]/g,
        extract: (match) => match[1].trim()
      },
      // Alt text
      {
        name: 'Alt Text',
        regex: /alt\s*=\s*['"`]([^'"`\n]+)['"`]/g,
        extract: (match) => match[1].trim()
      },
      // Aria labels
      {
        name: 'Aria Label',
        regex: /aria-label\s*=\s*['"`]([^'"`\n]+)['"`]/g,
        extract: (match) => match[1].trim()
      },
      // Button text, labels etc
      {
        name: 'Label/Text Props',
        regex: /(?:label|text|content)\s*[:=]\s*['"`]([^'"`\n]+)['"`]/g,
        extract: (match) => match[1].trim()
      }
    ];

    const foundStrings = [];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        const text = pattern.extract(match);
        
        if (isTranslatableText(text)) {
          foundStrings.push({
            type: pattern.name,
            text: text,
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    });

    // Process found strings
    foundStrings.forEach(item => {
      const key = generateKeyFromText(item.text);
      
      parser.parseFuncFromString(
        `t('${key}', '${item.text}')`,
        { list: ['t'] },
        (key, options) => {
          parser.set(key, options.defaultValue || item.text);
        }
      );
      count++;
      
      console.log(`   ✅ ${item.type}: "${item.text}" → "${key}" (line ${item.line})`);
    });

    if (count > 0) {
      console.log(`   📊 Found ${count} translatable strings in ${file.relative}\n`);
    } else {
      console.log(`   ⏭️  No translatable strings found in ${file.relative}\n`);
    }

    done();

    // Helper functions
    function isTranslatableText(text) {
      if (!text || text.length < 2 || text.length > 200) return false;
      
      // Must contain at least one letter
      if (!/[a-zA-Z]/.test(text)) return false;
      
      // Skip if it's likely a variable, component name, or code
      const skipPatterns = [
        /^[A-Z_][A-Z0-9_]*$/, // CONSTANTS
        /^[a-z]+[A-Z]/, // camelCase variables
        /^\d+$/, // pure numbers
        /^https?:\/\//, // URLs
        /^\//, // file paths
        /^\w+\(/, // function calls
        /^#[0-9a-fA-F]{3,6}$/, // hex colors
        /^rgb\(/, // CSS colors
        /^[a-z-]+$/, // CSS class names (kebab-case) - but allow if it has spaces
        /^\$\{/, // template literals
        /^{{/, // template syntax
        /^\w+@\w+/, // email addresses
        /^[0-9.]+[a-z]+$/i, // measurements (10px, 2rem, etc)
        /console\.|window\.|document\./, // JavaScript APIs
        /className|onClick|onChange|onSubmit/i, // React props
      ];

      // Allow if it contains spaces (likely user-facing text)
      if (text.includes(' ') && text.split(' ').length >= 2) {
        return !skipPatterns.some(pattern => pattern.test(text));
      }
      
      // For single words, be more strict
      return text.length > 3 && 
             !skipPatterns.some(pattern => pattern.test(text)) &&
             /^[A-Z]/.test(text); // Likely starts with capital (proper text)
    }

    function generateKeyFromText(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special chars
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .substring(0, 50) // Limit length
        .replace(/_+$/, ''); // Remove trailing underscores
    }
  }
};