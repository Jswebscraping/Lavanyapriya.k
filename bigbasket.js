const puppeteer = require('puppeteer');
const fs = require('fs')


try {
(async () => {
     
     const browser = await puppeteer.launch({headless:false})
     const page = await browser.newPage()
     await page.setViewport({ width: 1280, height: 800 })
     await page.goto("https://www.bigbasket.com", {waitUntil:'networkidle2',timeout:0});
     await page.focus('#input');
     await page.keyboard.type('Beverages');
     await page.click('.bb-search');
     await page.waitForTimeout(5000);
     var button= await page.$x('//*[@id="deck"]/div[5]/div/div/label/span[2]');
   

      const details = [];
      for(let j=0;j<button.length;j++){
      await page.waitForTimeout(5000);

      var button= await page.$x('//*[@id="deck"]/div[5]/div/div/label/span[2]');
      await button[j].click();
      await page.waitForTimeout(10000);
      const brandname = await page.$x('//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div/product-template/div/div[4]/div[1]/h6');
      const productname=await page.$x('//*[@class="col-sm-12 col-xs-7 prod-name"]');
      const price=await page.$x('//span[@class="discnt-price"]');
      const ratings=await page.$x('//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div/product-template/div/div[4]/div[1]/div/span[2]/span[1]');

      for(i=0;productname.length;i++) {
      try{
      details.push ({
      brandname:await page.evaluate(el => el.textContent,brandname[i]),
      productname:await page.evaluate(el => el.textContent,productname[i]),
      price:await page.evaluate(el => el.textContent,price[i]),
      ratings:await page.evaluate(el => el.textContent,ratings[i]),
     })
    }
    catch(e)
    {
        console.log("link err");
    }
      }
      const clearbutton=await page.$x('//*[@class="clear-all"]')
      await clearbutton[0].click(); 
      await page.waitForTimeout(10000);

    }
      console.log(details)

      await browser.close();

      fs.writeFile("bigbasket.csv",JSON.stringify(details,'',2),(err) => {
        if(err){console.log(err)}
        else{console.log('Saved Successfully!')}
    });

  })()

}
    catch(e)
    {
        console.log("Error",e);
    }