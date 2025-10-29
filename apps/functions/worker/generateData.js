import { extract as extractRates } from './extractors/Arihanspot_extractor.js';
import { writeFile } from "fs/promises";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";


const data = await fetchAndProcess();
const preProcData = preProcessData(data.products || []);

    const fullData = {
        rates: data.rates,        
        ticker: data.ticker,
        sub_categories: preProcData.sub_categories,
        categorizedProducts: preProcData.categorizedProducts
    };
if (data) {	
try {
    await writeFile("data.json", JSON.stringify(fullData, null, 2), "utf8");
    console.log("✅ File written successfully!");
  } catch (err) {
    console.error("❌ Error writing file:", err);
  }
}

async function fetchAndProcess() {
	const response = await fetch(SHEET_URL);
	const all = await response.json();
	const rateConfig = all.rate_config.arihant_spot;
	let [goldRate, silverRate] = await extractRates(rateConfig);
	if (rateConfig.gold.display <= 0)
		goldRate = 0;
	if (rateConfig.silver.display <= 0)
		silverRate = 0;
	return {
		rates: {
			asOn: new Date().toISOString(),
			"gold24K": goldRate,
			"gold22K": +(goldRate * 0.92).toFixed(2),
			"gold18K": +(goldRate * 0.75).toFixed(2),
			"silver": silverRate,
			"silverJewelry": +(silverRate * 0.92).toFixed(2),
		},
		products: all.products,
		ticker: all.ticker
	};
}

function preProcessData(products) {
    if (!products || products.length === 0) {
        return { sub_categories: [], categorizedProducts: {} };
    }

    // 1. Calculate unique and sorted sub_categories
    const allCategories = products.map(product => product.sub_category);
    const uniqueCategories = Array.from(new Set(allCategories));
    const sub_categories = uniqueCategories.sort();

    // 2. Group products by category
    const categorizedProducts = products.reduce((acc, product) => {
        const category = product.sub_category;

        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return { sub_categories, categorizedProducts };
}
