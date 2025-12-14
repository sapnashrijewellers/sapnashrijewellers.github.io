export const RateConfigKey="arihant_spot";
async function fetchRate(url) {
    const res = await fetch(url,
        {
            method: "GET",
            headers: {
                'origin': 'https://www.arihantspot.in',
                'accept': 'text/plain, */*; q=0.01',
                'referer': 'https://www.arihantspot.in/',
                'sec-CH-UA': '"Not=A?Brand";v="24", "Chromium";v="140"',
                'sec-CH-UA-Mobile': '?0',
                'sec-CH-UA-Platform': '"Linux"',
                'sec-Fetch-Dest': 'empty',
                'sec-Fetch-Mode': 'cors',
                'sec-Fetch-Site': 'same-site',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });
    const data = await res.text();
    return data;
}

export async function extract(rateConfig) {

    const goldURL = 'https://bcast.arihantspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/arihant?_=';
    const silverURL = 'https://bcast.arihantspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/arihantsilver?_=';


    const [goldDataText, silverDataText] = await Promise.all([
        fetchRate(goldURL),
        fetchRate(silverURL)
    ]);

    // 2. CPU Time Optimization: Pre-process the data *once* before parsing.
    const goldDataMap = preProcessData(goldDataText);
    const silverDataMap = preProcessData(silverDataText);

    // 3. Parsing: Use the efficient Maps for lookups.
    const goldRate = parseGold(goldDataMap, rateConfig);
    const silverRate = parseSilver(silverDataMap, rateConfig);

    // The original `|| 0` logic in fetchRate is now handled by `getValue` returning 0.
    return [goldRate, silverRate];
}

function parseGold(inputData, rateConfig) {

    let price = getValue(inputData, 2728, 3);
    return (price) / 10;
}

function parseSilver(inputData, rateConfig) {
    let price = getValue(inputData, 2719, 3);
    if (price <= 0) {
        price = getValue(inputData, 2591, 3);
    }
    return price / 1000;
}

/**
 * Optimized getValue: retrieves from the pre-processed Map.
 * @param {Map<string, string[]>} dataMap The pre-processed data map.
 * @param {number} rowId The ID of the row to look up.
 * @param {number} colIndex The 0-based index of the column value to extract.
 * @returns {number} The parsed value, or 0 if not found/invalid.
 */
function getValue(dataMap, rowId, colIndex) {
    const rowIdStr = String(rowId);
    const cells = dataMap.get(rowIdStr);

    if (cells && cells[colIndex] !== undefined) {
        const value = parseFloat(cells[colIndex]);
        // Return 0 if NaN, as per original logic, otherwise the number
        return isNaN(value) ? 0 : value;
    }

    return 0; // Return 0 if row/cell not found
}

function preProcessData(textData) {
    const dataMap = new Map();
    // Trim and split by newline to get lines
    const lines = textData.trim().split("\n").filter(line => line.length > 0);

    for (const line of lines) {
        // Use a robust regex to handle one or more tabs as separator
        const cells = line.trim().split(/\t+/);
        if (cells.length > 0) {
            // The first cell is the row ID
            dataMap.set(cells[0], cells);
        }
    }
    return dataMap;
}
