// Extracting All The Product Details (Product Name, Product Price, Product Comparision Price) In Three WebPage
const puppeteer = require('puppeteer');
const fs = require('fs');

try {
    const urls = [
        'https://www.loblaws.ca/search?search-bar=Dry%20puppy%20food',
        'https://www.loblaws.ca/search?search-bar=baby%20food',
        'https://www.loblaws.ca/search?search-bar=chocolate%20icecream',
    ];
    for(let i = 0;i < 3;i++) {
        GrabDetail(urls[i]);
      };
    async function GrabDetail(url) {
        const arr = [];
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto(url,{waitUntil:'load'});
        await page.waitForTimeout(20000);
        await page.waitForSelector("#site-content > div > div > div > div.product-grid > div.product-grid__results > div.product-grid__results__products > div > ul");
        await page.waitForNetworkIdle({waitUntil:'networkidle2'});

        const details = await page.$$('#site-content > div > div > div > div.product-grid > div.product-grid__results > div.product-grid__results__products > div > ul');
        
        for(const a of details) {
        const productName = await a.$$eval('.product-name--', (span) => {
            return span.map(x => x.innerText)});
        const productPrice = await a.$$eval('.selling-price-list__item__price--__value', (span) => {
            return span.map(x => x.innerText)});
        const productCompPrice = await a.$$eval('.comparison-price-list__item__price', (span) => {
            return span.map(x=> x.innerText)});

        let len = Math.max(productName.length,productCompPrice.length,productPrice.length);
        for(i = 0;i < len;i++) {
            arr.push({
                ProductName : productName[i],
                ProductPrice : productPrice[i],
                ProductComparisionPrice : productCompPrice[i],
            });
        };
    };
    await browser.close();
    fs.appendFile("LobLaws.json",JSON.stringify(arr,'',2),(err) => {
        if(err){console.log(err)}
        else{console.log('Saved Successfully!')};
    });
    console.log(arr);
    return arr;
};
}
catch(e) {
    console.log("error",e);
};




/*
const Products = [];
    for(let i = 0;i < 3;i++) {
       //console.log();
        Products.push({
           'Page Url' : urls[i],
          'Page Details' : GrabDetail(urls[i]),
       });
       fs.appendFile("LobLaws.json",JSON.stringify(Products,'',2),(err) => {
        if(err){console.log(err)}
        else{console.log('Saved Successfully!')};
    });
*/    