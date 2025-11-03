import { extract as extractRates } from '../extractors/Arihanspot_extractor.js';
import { writeFile } from "fs/promises";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";


const data = await fetchAndProcess();
if (data) {	
try {   
    
    await writeFile("rates.json", JSON.stringify(data.rates, null, 2), "utf8");


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
		}		
	};
}

