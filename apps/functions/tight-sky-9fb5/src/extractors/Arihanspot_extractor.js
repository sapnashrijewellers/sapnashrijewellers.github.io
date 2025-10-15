// Helper to fetch rate from MMTc
async function fetchRate(url, rateConfig, fun) {
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
    return fun(data, rateConfig) || 0;
}

export async function extract(rateConfig) {
    
    const goldURL = 'https://bcast.arihantspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/arihant?_=';
    const silverURL = 'https://bcast.arihantspot.com:7768/VOTSBroadcastStreaming/Services/xml/GetLiveRateByTemplateID/arihantsilver?_=';


    const [goldRate, silverRate] = await Promise.all([
        fetchRate(goldURL, rateConfig, parseGold),
        fetchRate(silverURL, rateConfig, parseSilver)
    ]);
    return [goldRate, silverRate];
}

function parseGold(inputData, rateConfig) {    
    let price = getValue(inputData, 2728, 3);    
    price = price + (price * (rateConfig.gold.diff/100)) 
    return (price + rateConfig.gold.absolute) / 10;
}

function parseSilver(inputData, rateConfig) {
    let price = getValue(inputData, 2719, 3);
    price = price + (price * (rateConfig.silver.diff/100))
    if (price <= 0) {
        price = getValue(inputData, 2591, 3);
        price = price + (price * (rateConfig.silver.costing/100))
    }
    return (price + rateConfig.silver.absolute) / 1000;
}
/**
* @fileoverview Utility to parse raw, multi-line, whitespace-separated data
* and extract a value based on offsets from the end of the table.
*/

/**
 * Extracts a specific value from a block of text data based on its
 * position relative to the end of the rows and columns.
 *
 * NOTE: This function assumes data is separated by whitespace (tabs/spaces).
 *
 * @param {string} rawData The input string containing the tabular data.
 * @param {number} rowOffsetFromEnd The offset from the last row. 1 means the last row,
 * 2 means the second last row, and so on.
 * @param {number} colOffsetFromEnd The offset from the last column in the target row.
 * 1 means the last column, 2 means the second last, and so on.
 * @returns {string | null} The extracted value as a string, or null if not found.
 */
function extractValueByOffset(rawData, rowOffsetFromEnd, colOffsetFromEnd) {
    if (rowOffsetFromEnd < 1 || colOffsetFromEnd < 1) {
        console.error("Offsets must be 1 or greater (1 = last row/column).");
        return null;
    }

    // 1. Split the data into individual rows
    const rows = rawData.split('\n')
        // Filter out empty lines or lines consisting only of whitespace
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Check if there are enough rows
    if (rows.length < rowOffsetFromEnd) {
        console.warn(`Not enough rows (${rows.length}) for requested offset ${rowOffsetFromEnd}.`);
        return null;
    }

    // 2. Determine the target row index
    // rows.length - rowOffsetFromEnd gives the 0-based index
    const targetRowIndex = rows.length - rowOffsetFromEnd;
    const targetRowData = rows[targetRowIndex];

    // 3. Split the target row into columns
    // The regex /\s+/ handles single or multiple spaces/tabs as a single separator
    const columns = targetRowData.split(/\s+/).filter(col => col.length > 0);

    // Check if there are enough columns
    if (columns.length < colOffsetFromEnd) {
        console.warn(`Not enough columns (${columns.length}) in row for requested offset ${colOffsetFromEnd}.`);
        return null;
    }

    // 4. Determine the target column index and return the value
    // columns.length - colOffsetFromEnd gives the 0-based index
    const targetColIndex = columns.length - colOffsetFromEnd;

    // We can also convert the result to a number here if required, 
    // but returning a string is safer for generic data.
    return columns[targetColIndex];


}

function getValue(textData, rowId, colIndex) {
    // Split into lines
    const lines = textData.trim().split("\n");

    for (let line of lines) {
        // Normalize spaces/tabs and split into cells
        let cells = line.trim().split(/\t+/);

        if (cells[0] === String(rowId)) {
            if (cells[colIndex] !== undefined) {
                const value = parseFloat(cells[colIndex]);
                return isNaN(value) ? 0 : value; // Return number if valid, else null
            } else {
                return null;
            }
        }
    }

    // If not found
    return null;
}

