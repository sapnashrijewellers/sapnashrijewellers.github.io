export const RateConfigKey="metalpriceapi";
async function fetchRate(currencyPair) {
    const res = await fetch("https://api.metalpriceapi.com/v1/latest?api_key=dc3e2e6d03dc8db18554797a1539174f&base=INR&currencies=XAU,XAG",
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });

    const data = await res.json();
   
    
    let gPrice, sPrice;
    
    gPrice = data.rates.INRXAU;
    sPrice = data.rates.INRXAG;
    
    gPrice = gPrice / 31.1035;
    sPrice = sPrice / 31.1035;
    return [gPrice*10, sPrice];

}

export async function extract() {
    const rate = await fetchRate();
    return rate;
}