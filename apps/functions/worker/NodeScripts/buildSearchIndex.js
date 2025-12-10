import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MiniSearch from 'minisearch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read catalog
const catalogPath = path.join(__dirname, '../input/catalog.json')
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))


const normalize = s =>
  (s || '')
    .toString()
    .normalize("NFC")  // keeps matras properly connected
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\u0900-\u097F]+/gu, ' ')
    .trim();

const productsForIndex = catalog.products.map(p => ({
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

  processTerm: term => term.toLowerCase()
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