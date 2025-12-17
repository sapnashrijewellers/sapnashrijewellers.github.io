import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import MiniSearch from 'minisearch'
import { miniSearchIndexOptions, normalize } from "../catalog/search/shared.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.join(__dirname, '../catalog/data/products.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

const productsForIndex = catalog
   .filter(p => p.active && p.name?.length > 3 && p.weight > 0)
   .map(p => ({
      id: p.id,
      name: normalize(p.name),
      highlights: normalize(p.highlights?.join(' ')),
      englishHighlights: normalize(p.englishHighlights?.join(' ')),
      category: normalize(p.category),
      keywords: normalize(p.keywords),
      description: normalize(p.description),
      type: normalize(p.type?.join(' ')),
      for: normalize(p.for),
      purity: normalize(p.purity),
      slug: p.slug,
      images: p.images,
      newArrival: p.newArrival
   }));

const miniSearch = new MiniSearch(miniSearchIndexOptions);

miniSearch.addAll(productsForIndex)


const outputDir = path.join(__dirname, '../catalog/public/data')
fs.mkdirSync(outputDir, { recursive: true })

const outputPath = path.join(outputDir, 'search-index.json')
const indexJSON = JSON.stringify(miniSearch)

fs.writeFileSync(outputPath, indexJSON)

console.log('✅ Search index built')
console.log(`📦 Products indexed: ${productsForIndex.length}`)
console.log(`📊 Index size: ${(indexJSON.length / 1024).toFixed(2)} KB`)
