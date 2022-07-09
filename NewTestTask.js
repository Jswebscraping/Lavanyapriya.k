const puppeteer = require('puppeteer');
const fs = require('fs');
try {
    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const link=['https://www.noon.com/uae-en/round-hammock-chair-swing-white/N33427922A/p/?o=f932689a052e559a', 'https://www.noon.com/uae-en/adjustable-height-portable-table-light-blue/N48047063A/p/?o=af310a7c45abebda', 'https://www.noon.com/uae-en/ultralight-camping-hammock-with-backpack-multicolour-279x152x199cm/N15688963A/p/?o=bb05d3f3c8c1f22d'
             ,'https://www.noon.com/uae-en/foldable-personal-table-white-black-65-8-x45-5-x71-1cm/N40859204A/p/?o=eabe8b7d5fb38dca', 'https://www.noon.com/uae-en/multi-layer-balcony-storage-shelf-with-wheels-brown-106-x-25-x-95cm/N46442121A/p/?o=a813b770f6aa4c8d', 'https://www.noon.com/uae-en/3-piece-breeze-balcony-set-white-black-55x53x75cm/N49934995A/p/?o=de20db7492b1e05a'];
        for (let i = 0; i < link.length; i++) {
            try {
                await page.goto(link[i], { waitUntil: 'load' });
                await page.waitForTimeout(10000);
            } catch (e) {
                console.log("link err");
            }
            const main = await page.$x('//*[@id="__next"]/div/section');
            await page.waitForNetworkIdle({ waitUntil: 'networkidle2' });
            const output = [];
            var brandname = await page.$x('//*[@class="sc-e05b6c79-11 citSCZ"]');
            var product_title = await page.$x('//*[@class="sc-e05b6c79-12 hVvRsw"]');
            var product_price = await page.$x('//div[@class="priceNow"]');
            var productoverview = await page.$x('//div[@class="sc-9a80c80f-0 bQtHyJ"]');
           
            for (j = 0; j < brandname.length; j++) {
                try {
                    output.push({

                        brandname: await page.evaluate(h1 => h1.textContent, brandname[j]),
                        product_title: await page.evaluate(h1 => h1.textContent, product_title[j]),
                        product_price: await page.evaluate(xl => xl.textContent, product_price[j]),
                        productoverview: await page.evaluate(x2 => x2.textContent, productoverview[j]),
                
                    })
                    var secondaryimage = await page.$x('//div[@class="sc-10573ab8-3 jPBSVV"]//@src');
                    await page.waitForNetworkIdle({ waitUntil: 'networkidle2' });
                    for (let k=0;k< secondaryimage.length;k++) {
                        
                            output.push({
                                secondaryimage: await page.evaluate(x2 => x2.textContent, secondaryimage[k]),
                            })
                            console.log(output);
                        }  
                }
            
        
        catch (e) {
                    console.log("link err");
                }
            }
        
        }
    
        
        fs.appendFile("NewTestTask.json", JSON.stringify(output, '', 2), (err) => {
            if (err) { console.log(err) }
            else { console.log('Saved Successfully!') };
        })


        await browser.close();
    })();


}
catch (e) {

    console.log("error", e);
};











