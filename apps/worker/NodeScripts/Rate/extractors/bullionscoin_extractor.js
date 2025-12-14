import { extractByClass } from '../utils/htmlScraper.js';
export const RateConfigKey="bullions_co_in";
export async function extract() {
    
    let extractedText = await extractByClass("https://bullions.co.in",
        "data-box-half-value");

    

    let [goldRate, silverRate] = extractRates(extractedText);

    goldRate = goldRate / 10;
    silverRate = silverRate / 1000;

    return [goldRate, silverRate];
}

function extractRates(extractedText)
{
    const numberRegex = /\d+\.\d{2}/g;
    let cleanedText = extractedText
        .replace(/<[^>]*>/g, '') // Remove all remaining tags
        .replace(/,/g, '')
        .replace(/\+/g, ' ')
        .trim();

    // 2. Apply the regex to the cleaned text to isolate the primary number value
    const match = cleanedText.match(numberRegex);
    
    if (match && match[0]) {
        return [match[0], match[2]];
    } else {
        throw new Error(`Not able to parse rates`);
    }
}