
const puppeteer = require('puppeteer');
const fs = require('fs')

try {
(async() => {
const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();

await page.goto('https://www.nseindia.com/get-quotes/equity?symbol=SBIN' , {waitUntil:'load'});
await page.waitForTimeout(2000);



const info = await page.$eval('#securityInfo > thead > tr', x => x.innerText);
const main = await page.$eval('#securityInfo > tbody > tr', x => x.innerText);

console.log(info,main);
await browser.close();
fs.writeFile("Securityinformation.txt",JSON.stringify(info,main,'',2),(err) => {
    if(err){console.log(err)}
    else{console.log('Saved Successfully!')}    
});
})()
}
catch(e)
{
    console.log("Error",e);
}
