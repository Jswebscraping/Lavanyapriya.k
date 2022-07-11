const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');

async function Mongo(product) {
    const url = 'mongodb://localhost:27017';
    MongoClient.connect(url,function(err,db) {
    if(err) console.log("Error",err)
    const mydb = db.db('Grofers');

    mydb.collection('Grofers').insertOne(product,function (err,res) {
        if(err) console.log("Error",err);
        console.log("Document Inserted");
        db.close();
      });
    })
}  
async function GetDetails() {
    const response = await fetch('https://grofers.com/v6/merchant/29815/product/313249/', {
        method: 'GET',
        });
        const product = await response.json();
        console.log(product.data.product);
        Mongo(product);
    }
GetDetails();