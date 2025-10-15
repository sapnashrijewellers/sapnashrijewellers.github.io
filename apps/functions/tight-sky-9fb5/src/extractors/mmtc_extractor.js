// Helper to fetch rate from MMTc
async function fetchRate(currencyPair) {
    const res = await fetch("https://cem.mmtcpamp.com/pvt/getNonExecutableQuote",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://www.mmtcpamp.com',
                'Sec-CH-UA': '"Not=A?Brand";v="24", "Chromium";v="140"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Linux"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({ currencyPair, type: "BUY" }),
        });

    const data = await res.json();    
    return parseFloat(data.totalAmount) || 0;
}

export async function extract() {
      const [goldRate, silverRate] = await Promise.all([
		fetchRate("XAU/INR"),
		fetchRate("XAG/INR")
	  ]);	      
    return [goldRate, silverRate];
}