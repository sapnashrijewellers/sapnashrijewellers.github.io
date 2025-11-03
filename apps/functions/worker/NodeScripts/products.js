import { writeFile } from "fs/promises";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";


const data = await fetchAndProcess();
if (data) {	
try {
    const preProcData = preProcessData(data.products || []);

    const fullData = {        
        ticker: data.ticker,
        sub_categories: preProcData.sub_categories,
        categorizedProducts: preProcData.categorizedProducts
    };

    await writeFile("data.json", JSON.stringify(fullData, null, 2), "utf8");

    console.log("✅ File written successfully!");
  } catch (err) {
    console.error("❌ Error writing file:", err);
  }
}

async function fetchAndProcess() {
	const response = await fetch(SHEET_URL);
	const all = await response.json();	
	return {		
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
