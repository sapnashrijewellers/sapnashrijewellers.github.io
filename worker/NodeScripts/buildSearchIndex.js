import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MiniSearch from 'minisearch';

// -----------------------------------------------------------------------------
// NOTE: The 'import type { Product }' line is completely removed in JS, 
// as interfaces are stripped by the compiler.
// -----------------------------------------------------------------------------

// ES Module way to get __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read catalog
// NOTE: Relative path assumes execution from the correct location 
// or may need to be adjusted based on __dirname
const catalogPath = path.join(__dirname, '../../catalog/data/products.json'); 

try {
  // Use synchronous read for initial data loading, as in the original TS
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

  /**
   * Normalizes a string for indexing and searching.
   * @param {string} s
   * @returns {string}
   */
  const normalize = (s) =>
    (s || '')
      .toString()
      .normalize("NFC")  // keeps matras properly connected
      .toLowerCase()
      .replace(/[^0-9a-zA-Z\u0900-\u097F]+/gu, ' ')
      .trim();

  /**
   * Normalizes and stems a single search term.
   * @param {string} term
   * @returns {string}
   */
  function normalizeTerm(term) {
    if (!term) return "";

    // Base normalization
    let t = term.normalize("NFKC").toLowerCase().trim();

    // Remove nukta only
    t = t.replace(/\u093C/g, "");

    // ----------------------------------------------------
    // 1. Direct dictionary mapping (English + Hindi)
    // ----------------------------------------------------
    const map = {
      // English singular forms
      "bangles": "bangle",
      "bracelets": "bracelet",
      "chains": "chain",
      "rings": "ring",
      "earrings": "earring",
      "pendants": "pendant",
      "necklaces": "necklace",
      "anklets": "anklet",

      // Common variants
      "chudiya": "bangle",
      "chudia": "bangle",
      "chudi": "bangle",
      "chudiyao": "bangle",

      // Hindi plural → singular
      "चूड़ियाँ": "चूड़ी",
      "चूड़ियों": "चूड़ी",
      "चूड़ि": "चूड़ी",

      "अंगूठियाँ": "अंगूठी",
      "अंगूठियों": "अंगूठी",

      "बिछियाँ": "बिछिया",
      "बिछियों": "बिछिया",
    };

    if (map[t]) return map[t];

    // ----------------------------------------------------
    // 2. English safe stemming (protected exceptions)
    // ----------------------------------------------------
    const english = /^[a-z]+$/.test(t);

    if (english) {
      const protectedWords = [
        "bangle", "bangles",
        "ring", "rings",
        "chain", "chains",
        "bracelet", "bracelets",
        "earring", "earrings",
        "pendant", "pendants",
        "necklace", "necklaces"
      ];

      // Note: Original TS logic was slightly off for protected words.
      // This logic ensures if it's protected, it returns the singular form.
      if (protectedWords.includes(t)) return t.endsWith("s") ? t.slice(0, -1) : t;

      // Generic safe rules (only if not protected)
      if (t.endsWith("ies") && t.length > 4) return t.slice(0, -3) + "y";
      if (t.endsWith("es") && t.length > 4) return t.slice(0, -2);
      if (t.endsWith("s") && t.length > 3) return t.slice(0, -1);
    }

    return t;
  }

  // Map products for indexing
  const productsForIndex = catalog.map(p => ({
    ...p,
    // Note: Type annotations (p: Product) are removed here
    searchableName: normalize(p.name.replace(/\|\s*/g, ' ')),
    keywords: normalize(p.keywords),
    type: Array.isArray(p.type) ? normalize(p.type.join(' ')) : normalize(p.type),
    highlights: Array.isArray(p.highlights) ? normalize(p.highlights.join(' ')) : normalize(p.highlights),
    category: normalize(p.category),
    for: normalize(p.for),
    purity: normalize(p.purity)
  }));

  const miniSearch = new MiniSearch({
    fields: [
      'searchableName',
      'name',
      'keywords',
      'type',
      'category',
      'for',
      'purity',
      'highlights'
    ],
    storeFields: [
      'id',
      'name',
      'weight',
      'purity',
      'images',
      'category',
      'for',
      'slug',
      'newArrival'
    ],

    searchOptions: {
      fuzzy: 0.2,
      prefix: true,
      combineWith: 'OR',
      tokenize: (text) => {
         // The original TS had 'tokenize: 'full'' which is invalid for MiniSearch.
         // Since the subsequent 'tokenize(text)' function was provided, 
         // we assume it overrides and provides the intended logic.
         return (text || '')
          .normalize("NFC")
          .toLowerCase()
          .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || [];
      },
      boost: {
        name: 3.5,
        searchableName: 4,
        keywords: 3,
        type: 2,
        category: 1.5,
        purity: 1.2,
        highlights: 1
      },
      boostDocument: (doc, term) => {
        // Extra weight if the term appears in keywords
        if (doc.keywords?.includes(term)) return 2
        return 1
      }
    },

    // NOTE: The inline tokenize option is complex. Given the two 'tokenize' 
    // definitions in the TS, we consolidate them, assuming the function 
    // definition is the intended final behavior, as the 'tokenize: 'full'' 
    // is often invalid type. We use the function definition provided.
    tokenize(text) {
      return (text || '')
        .normalize("NFC")
        .toLowerCase()
        .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || [];
    },

    processTerm: (term) => normalizeTerm(term)
  });

  miniSearch.addAll(productsForIndex);

  // Serialize the index
  const indexJSON = JSON.stringify(miniSearch);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../catalog/public/data/'); 
  // NOTE: Corrected outputDir calculation to be the directory path
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'search-index.json');
  fs.writeFileSync(outputPath, indexJSON);

  console.log('✅ Search index built successfully!');
  console.log(`📦 Indexed ${catalog.length} products`);
  console.log(`💾 Output: ${outputPath}`);
  console.log(`📊 Index size: ${(indexJSON.length / 1024).toFixed(2)} KB`);

} catch (error) {
  console.error("❌ Failed to build search index:", error.message);
}