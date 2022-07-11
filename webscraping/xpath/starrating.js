const puppeteer = require('puppeteer');
try{
(async () => {
     
     const browser = await puppeteer.launch({headless:false})
     const page = await browser.newPage()
     const link=['https://www.chemistwarehouse.co.nz/buy/101750/essie-nail-polish-ballet-slippers-6','https://www.chemistwarehouse.co.nz/buy/83446/dermal-therapy-anti-itch-soothing-cream-85g','https://www.chemistwarehouse.co.nz/buy/1159/betadine-sore-throat-ready-to-use-120ml'];
     for(let i=0;i<link.length;i++){
     try{
     await page.goto(link[i],{waitUntil:'load'});
     await page.waitForTimeout(10000);
     const main=await page.$x('//*[@id="BVRRContainer"]//*[@class="bv-write-review-container bv-write-container"]/button');
     await main[0].hover();
     //await page.waitForXPath('//*[@class="bv-secondary-rating-summary-rating bv-table-cell"]')
     //This function tells the browser we want it to execute an XPath query.
     var star= await page.$x('//*[@id="BVRRContainer"]//*[@class="bv-secondary-rating-summary-rating bv-table-cell"]');
     let starrate = await page.evaluate(el => el.textContent, star[0]);
     console.log(starrate);
     }
     catch(e){
         console.log("hidden rating");
     }
    }
    
     await browser.close();
})();
}

catch(e)
{
    console.log("Error",e);
}
