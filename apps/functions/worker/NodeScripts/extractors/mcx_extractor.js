export const RateConfigKey = "mcx";
export async function extract() {
    const mcxTickerData = await getMCXTicker();
    
    let goldRate = mcxTickerData.find(x => x.Symbol === "GOLD").LTP;
    let silverRate = mcxTickerData.find(x => x.Symbol === "SILVER").LTP;
    
    goldRate = parseFloat(goldRate) || 0
    silverRate = parseFloat(silverRate) || 0
    silverRate = silverRate / 1000;
    
    return [goldRate, silverRate];
}

async function getMCXTicker() {
    const res = await fetch("https://www.mcxindia.com/BackPage.aspx/GetTicker",
        {
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json; charset=UTF-8',
                'Origin': 'https://www.mcxindia.com',
                'referer': 'https://www.mcxindia.com/',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({})
        });

    const ticker = await res.json();
    const result = ticker.d.Data.filter(item =>
        ["GOLD", "SILVER"].includes(item.Symbol));
    return result;
}