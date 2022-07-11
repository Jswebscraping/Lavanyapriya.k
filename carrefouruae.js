const puppeteer = require('puppeteer');
const fs = require('fs');
const { Parser } = require('json2csv');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');

try{
    async function CarrefourUAE() {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto("https://www.carrefouruae.com/mafuae/en/", {waitUntil:'load'});
        await page.waitForTimeout(4000);
        const arr1 = [];
        
        // Read the file contents 
        const keyword = fs.readFileSync("./InputKeywords.csv",'utf-8');
        const keywords = keyword.split(',\r\n');
        //console.log(keywords);

        //Reading Xpath from file
        const xpath = fs.readFileSync("./Xpath.csv",'utf-8');
        const xpaths = xpath.split(',\r\n');
        //console.log(xpaths);

        for(let i=0;i<keywords.length;i++) {
            const arr = [];
            const searchBar = await page.$x(xpaths[0]);
            await searchBar[0].type(keywords[i],{delay:100})
            await page.keyboard.press('Enter');
            await page.waitForTimeout(5000);
            await scrollPageToBottom(page);
            await page.waitForTimeout(5000);

            const productName =  await page.$x(xpaths[1]);
            const productPrice = await page.$x(xpaths[2]);
            const productImage = await page.$x(xpaths[3]);
            const productURL = await page.$x(xpaths[4]);
            const productSize = await page.$x(xpaths[5]);

            for(let j=0;j<productName.length;j++) {
                try{
                arr.push({
                    ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                    ProductPrice : await page.evaluate(el=>el.textContent,productPrice[j]),
                    ProductSize : await page.evaluate(el=>el.textContent,productSize[j]),
                    ProductPrimaryImage : await page.evaluate(el=>el.src,productImage[j]),
                    ProductURL : await page.evaluate(el=>el.href,productURL[j]),
                    });
                }
                catch(e) {
                    arr.push({
                        ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                        ProductPrice : await page.evaluate(el=>el.textContent,productPrice[j]),
                        ProductSize : '',
                        ProductPrimaryImage : await page.evaluate(el=>el.src,productImage[j]),
                        ProductURL : await page.evaluate(el=>el.href,productURL[j]),
                    });
                }
            }
            await ClearSearch(page);
            arr1.push(arr);
        }
        for(let i =0;i<arr1.length;i++) {
        const arr1tocsv = new Parser({fields:["ProductName","ProductPrice","ProductSize","ProductPrimaryImage","ProductURL"]}).parse(arr1[i]);
        fs.appendFileSync("./Carrefouruae_CSV.csv",arr1tocsv);
        }
        //console.log(arr1,arr1.length);
        await browser.close();
    }
    //SearchBox Function Used to clear the SearchBox for next Input
    async function ClearSearch(page) {
        const searchBox = await page.$x('//*[@class="css-1jv2uvu"]//div[@class="css-1by272f"]//input[@class="css-12uq56f"]');
        await searchBox[0].focus();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control')
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(4000);
    }
    CarrefourUAE();
}
catch(e) {
    console.log("Error",e);
}