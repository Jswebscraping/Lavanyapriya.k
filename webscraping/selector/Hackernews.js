const puppeteer = require('puppeteer');

try{
(async() => {
const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();

await page.goto('https://news.ycombinator.com/' , {waitUntil:'load'});
await page.waitForTimeout(1500);
let results=[];
const main = await page.$$('.athing > td:last-child ');
for(let i = 0;i<10;i++){
    var website = await main[i].$eval('.titlelink', h1 => h1.innerText);
    var url = await main[i].$eval('.titlelink',a => a.href);
    results.push({  
        Website : website,
        WebURL : url,
    });
}

console.log(results)
await browser.close();



})()
}
catch(e)
{
    console.log("Error",e);
}
