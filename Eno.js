const puppeteer = require('puppeteer');
const fs = require('fs')

try {
(async() => {
const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();

await page.goto('https://blinkit.com/prn/eno-lemon-digestive-antacid/prid/10841' , {waitUntil:'load'});
await page.waitForTimeout(2000);

const title= await page.$eval('.kPXfrg', div=>div.innerText)
const weight= await page.$eval('.bZvIga', x=>x.innerText)
//const price=await page.$eval('.r-1d4mawv', h1=>h1.innerText)
const product=await page.$eval('.fOPLcr',h2=>h2.innerText)
const stock=await page.$eval('.ewNLnW', span=>span.innerText)


let output=[];
output.push({
    
    title:title,
    weight:weight,
    //price:price,
    product:product,
    details:stock,

})
console.log(output)

await browser.close();

fs.writeFile("Eno.json",JSON.stringify(output,'',2),(err) => {
    if(err){console.log(err)}
    else{console.log('Saved Successfully!')}
});

})()
}
catch(e)
{
    console.log("Error",e);
}

