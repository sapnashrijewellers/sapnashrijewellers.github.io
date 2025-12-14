import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MiniSearch from 'minisearch'
import { Product } from "../../types/catalog"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read catalog
const catalogPath = path.join(__dirname, '../input/catalog.json')
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))


const normalize = (s: string) =>
  (s || '')
    .toString()
    .normalize("NFC")  // keeps matras properly connected
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\u0900-\u097F]+/gu, ' ')
    .trim();

function normalizeTerm(term: string): string {
  if (!term) return ""

  // Base normalization
  let t = term.normalize("NFKC").toLowerCase().trim()

  // Remove nukta only
  t = t.replace(/\u093C/g, "")

  // ----------------------------------------------------
  // 1. Direct dictionary mapping (English + Hindi)
  // ----------------------------------------------------
  const map: Record<string, string> = {
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
  }

  if (map[t]) return map[t]

  // ----------------------------------------------------
  // 2. English safe stemming (protected exceptions)
  // ----------------------------------------------------
  const english = /^[a-z]+$/.test(t)

  if (english) {
    const protectedWords = [
      "bangle", "bangles",
      "ring", "rings",
      "chain", "chains",
      "bracelet", "bracelets",
      "earring", "earrings",
      "pendant", "pendants",
      "necklace", "necklaces"
    ]

    if (protectedWords.includes(t)) return t.endsWith("s") ? t.slice(0, -1) : t

    // Generic safe rules (only if not protected)
    if (t.endsWith("ies") && t.length > 4) return t.slice(0, -3) + "y"
    if (t.endsWith("es") && t.length > 4) return t.slice(0, -2)
    if (t.endsWith("s") && t.length > 3) return t.slice(0, -1)
  }

  return t
}


const productsForIndex = catalog.products.map((p: Product) => ({
  ...p,
  searchableName: normalize(p.name.replace(/\|\s*/g, ' ')),
  keywords: normalize(p.keywords),
  type: Array.isArray(p.type) ? normalize(p.type.join(' ')) : normalize(p.type),
  highlights: Array.isArray(p.highlights) ? normalize(p.highlights.join(' ')) : normalize(p.highlights),
  category: normalize(p.category),
  for: normalize(p.for),
  purity: normalize(p.purity)
}))

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
    tokenize: 'full',
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

  tokenize(text) {
    return (text || '')
      .normalize("NFC")
      .toLowerCase()
      .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || [];
  },

  //processTerm: term => term.toLowerCase()
  processTerm: (term) => normalizeTerm(term)
});

miniSearch.addAll(productsForIndex)

// Serialize the index
const indexJSON = JSON.stringify(miniSearch)

// Ensure output directory exists
const outputDir = path.join(__dirname, '../output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const outputPath = path.join(outputDir, 'search-index.json')
fs.writeFileSync(outputPath, indexJSON)

console.log('✅ Search index built successfully!')
console.log(`📦 Indexed ${catalog.products.length} products`)
console.log(`💾 Output: ${outputPath}`)
console.log(`📊 Index size: ${(indexJSON.length / 1024).toFixed(2)} KB`)