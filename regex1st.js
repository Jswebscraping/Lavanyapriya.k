const regex1 = RegExp('1159*');
var url = 'https://www.chemistwarehouse.co.nz/buy/1159/betadine-sore-throat-ready-to-use-120ml';
const result=regex1.exec(url);
console.log(result[0]); 
