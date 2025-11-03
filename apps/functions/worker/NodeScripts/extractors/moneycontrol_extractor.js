// Helper to fetch rate from MMTc
async function fetchSilverRate1(currencyPair) {
    //let url = 'https://priceapi.moneycontrol.com/pricefeed/mcx/commodityfutures/SILVER?';

    await getNearestExpiryDate();
    //const res = await get(url);
    
    //const data = await res.json();
  
    // Always include error handling for data.data being undefined/null
    //return parseFloat(data?.data?.lastPrice) || 0;
    return 50000;
}

async function fetchSilverRate(currencyPair) {
    await getNearestExpiryDate();
    
    return 50000;
}

async function fetchGoldRate(currencyPair) {
    return 10000;
}

async function get(url) {
    const res = await fetch(url,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*//*;q=0.8',
                'Origin': 'https://www.moneycontrol.com',
                'Sec-CH-UA': '"Not=A?Brand";v="24", "Chromium";v="140"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Linux"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'referer': 'https://www.moneycontrol.com/',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });        
    return await res;
}

// The function to fetch the URL and extract the date
async function getNearestExpiryDate() {
let url ='https://www.moneycontrol.com/commodity/mcx-silver-price/?type=futures&';
    // By default, fetch() has 'redirect: "follow"', which is what we want.
    const response = await get(url);

    if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        throw new Error(`HTTP Error: ${response.status}`);
    }

    // 1. CAPTURE THE FINAL URL
    const finalUrl = response.url;

    // 2. EXTRACT THE DATE
    const urlObject = new URL(finalUrl);
    const expiryDate = urlObject.searchParams.get('exp');

    if (expiryDate) {
        console.log(`Initial URL: ${initialUrl}`);
        console.log(`Final Redirected URL: ${finalUrl}`);
        console.log(`Captured Expiry Date: ${expiryDate}`);
        return expiryDate;
    } else {
        // This case might mean the redirect worked, but the server didn't include the 'exp' parameter.
        console.warn("Redirect successful, but 'exp' parameter not found in the final URL's query string.");
        return null;
    }

}

export async function extract() {
      const [goldRate, silverRate] = await Promise.all([
        fetchGoldRate("XAU/INR"),
        fetchSilverRate("XAG/INR")
      ]);	  
    
    return [goldRate, silverRate];
}
