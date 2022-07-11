const MongoClient = require('mongodb').MongoClient;
const puppeteer = require('puppeteer');
const fs = require('fs');

try{
    async function Mongo(arr1) {
        const url = 'mongodb://localhost:27017';
        MongoClient.connect(url,function(err,db) {
        if(err) console.log("Error",err)
        const mydb = db.db('MyDataBase');

        for(let i =0;i<arr1.length;i++) {
        mydb.collection('LobLaws').insertMany(arr1[i],function (err,res) {
            if(err) console.log("Error",err);
            console.log("Document Inserted");
            db.close();
          });
        }
        })
    } 
    async function LobLaws() {
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        await page.goto("https://www.loblaws.ca/", {waitUntil:'load'});
        await page.waitForTimeout(4000);
        const arr1 = [];
        
        // Read the file contents 
        const keyword = fs.readFileSync("./InputKeywords.csv",'utf-8');
        const keywords = keyword.split(',\r\n');

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

            const productName =  await page.$x(xpaths[1]);
            const productPrice = await page.$x(xpaths[2]);
            const productCompPrice = await page.$x(xpaths[3]);

            for(let j=0;j<productName.length;j++) {
                try{
                arr.push({
                    ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                    ProductPrice : await page.evaluate(el=>el.textContent,productPrice[j]),
                    ProductComparisionPrice : await page.evaluate(el=>el.textContent,productCompPrice[j]),
                    });
                }
                catch(e) { 
                    try{
                    arr.push({
                        ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                        ProductPrice : await page.evaluate(el=>el.textContent,productPrice[j]),
                        ProductComparisionPrice : "",
                    });
                    }
                    catch(e){
                        arr.push({
                            ProductName : await page.evaluate(el=>el.textContent,productName[j]),
                            ProductPrice : "",
                            ProductComparisionPrice : "",
                        });
                    }
                }
            }
            await ClearSearch(page);
            //console.log(arr);
            arr1.push(arr);
        }
        //console.log(arr1);
        Mongo(arr1);
        await browser.close();
    }
    //SearchBox Function Used to clear the SearchBox for next Input
    async function ClearSearch(page) {
        const searchBox = await page.$x('//*[@class="search-input__input"]');
        await searchBox[0].focus();
        await page.keyboard.down('Control');
        await page.keyboard.press('A');
        await page.keyboard.up('Control')
        await page.keyboard.press('Backspace');
        await page.waitForTimeout(4000);
    }
    LobLaws();
}
catch(e) {
    console.log("Error",e);
}