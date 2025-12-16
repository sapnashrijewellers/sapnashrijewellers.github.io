import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MiniSearch from 'minisearch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const catalogPath = path.join(__dirname, '../../catalog/data/products.json')

/* -------------------------------------------------------
   Normalization helpers
------------------------------------------------------- */

const normalize = (s = '') =>
  s
    .toString()
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^0-9a-zA-Z\u0900-\u097F]+/gu, ' ')
    .trim()

function normalizeTerm(term) {
  if (!term) return ''

  let t = term.normalize('NFKC').toLowerCase().trim()
  t = t.replace(/\u093C/g, '') // nukta removal

  const map = {
    bangles: 'bangle',
    bracelets: 'bracelet',
    chains: 'chain',
    rings: 'ring',
    earrings: 'earring',
    pendants: 'pendant',
    necklaces: 'necklace',
    anklets: 'anklet',

    chudiya: 'bangle',
    chudi: 'bangle',
    chudiyao: 'bangle',

    'चूड़ियाँ': 'चूड़ी',
    'चूड़ियों': 'चूड़ी',
    'अंगूठियाँ': 'अंगूठी',
    'अंगूठियों': 'अंगूठी',
    'बिछियाँ': 'बिछिया',
    'बिछियों': 'बिछिया'
  }

  if (map[t]) return map[t]

  if (/^[a-z]+$/.test(t)) {
    if (t.endsWith('ies') && t.length > 4) return t.slice(0, -3) + 'y'
    if (t.endsWith('es') && t.length > 4) return t.slice(0, -2)
    if (t.endsWith('s') && t.length > 3) return t.slice(0, -1)
  }

  return t
}

/* -------------------------------------------------------
   Load + Prepare Products
------------------------------------------------------- */

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'))

const productsForIndex = catalog
  .filter(p => p.active && p.name?.length > 3)
  .map(p => ({
    id: p.id,
    name: normalize(p.name),
    highlights: normalize(p.highlights?.join(' ')),
    englishHighlights: normalize(p.englishHighlights?.join(' ')),
    category: normalize(p.category),
    keywords: normalize(p.keywords),
    metaDescription: normalize(p.metaDescription),
    type: normalize(p.type?.join(' ')),
    for: normalize(p.for),
    purity: normalize(p.purity),

    // storeFields only
    slug: p.slug,
    images: p.images,
    newArrival: p.newArrival
  }))

/* -------------------------------------------------------
   MiniSearch Config
------------------------------------------------------- */

const miniSearch = new MiniSearch({
  fields: [
    'name',
    'highlights',
    'englishHighlights',
    'category',
    'keywords',
    'metaDescription',
    'type',
    'for',
    'purity'
  ],

  storeFields: [
    'id',
    'slug',
    'images',
    'category',
    'purity',
    'newArrival'
  ],

  tokenize(text) {
    return (
      text
        ?.normalize('NFC')
        .toLowerCase()
        .match(/[0-9a-zA-Z\u0900-\u097F]+/gu) || []
    )
  },

  processTerm: normalizeTerm,

  searchOptions: {
    fuzzy: 0.2,
    prefix: true,
    combineWith: 'OR',

    boost: {
      name: 5,
      highlights: 3.5,
      englishHighlights: 3,
      category: 2.5,
      keywords: 2.5,
      metaDescription: 2,
      type: 1.3,
      for: 1.2,
      purity: 1.1
    },

    boostDocument: (doc, term) =>
      doc.keywords?.includes(term) ? 1.5 : 1
  }
})

miniSearch.addAll(productsForIndex)

/* -------------------------------------------------------
   Write Index
------------------------------------------------------- */

const outputDir = path.join(__dirname, '../catalog/public/data')
fs.mkdirSync(outputDir, { recursive: true })

const outputPath = path.join(outputDir, 'search-index.json')
const indexJSON = JSON.stringify(miniSearch)

fs.writeFileSync(outputPath, indexJSON)

console.log('✅ Search index built')
console.log(`📦 Products indexed: ${productsForIndex.length}`)
console.log(`📊 Index size: ${(indexJSON.length / 1024).toFixed(2)} KB`)
