const puppeteer = require('puppeteer');
const fs = require('fs')
const key = fs.readFileSync("./keywords.csv", 'utf-8')
const data = key.split(',\r\n');
console.log(data);
var Mongoclient = require('mongodb').MongoClient;
try {
    (async () => {

        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage();
        await page.goto('https://www.flipkart.com', { waitUntil: 'load' });
        await page.waitForTimeout(40000);
        await page.click("._2KpZ6l._2doB4z");
        const results = [];
        for (i = 0; i < data.length; i++) {
            await page.waitForTimeout(10000);
            await page.focus('._3704LK');
            await page.keyboard.type(data[i]);
            await page.click('.L0Z3Pu');
            await page.waitForTimeout(10000);
            var button = await page.$x('//*[@id="container"]/div/div[3]/div[1]');

            var brandname = await page.$x('//*[@class="_3Djpdu"]');
            var product_title = await page.$x('//*[@class="s1Q9rs"]');
            var product_price = await page.$x('//*[@class="_30jeq3"]');
            var productrating = await page.$x('//*[@class="_2_R_DZ"]');
            for (j = 0; j < brandname.length; j++) {
                try {
                    results.push({

                        brandname: await page.evaluate(h1 => h1.textContent, brandname[j]),
                        product_title: await page.evaluate(h1 => h1.textContent, product_title[j]),
                        product_price: await page.evaluate(xl => xl.textContent, product_price[j]),
                        productrating: await page.evaluate(x2 => x2.textContent, productrating[j]),
                    })
                }

                catch (e) {
                    console.log("link err");
                }
            }

            console.log(results);
            await browser.close();
            const url = 'mongodb://localhost:27017';
            Mongoclient.connect(url, function (err, db) {
                if (err) console.log("Error", err)
                const mydb = db.db('Flipkart');
                mydb.collection('flipkartmongodb').insertMany(results, function (err, res) {
                    if (err) console.log("Error", err);
                    console.log("Document Inserted");
                    db.close();
                });
            })
        }
 })();
}
catch (e) {
    console.log("error", e);
}