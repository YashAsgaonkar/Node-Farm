

const { error } = require('console');
const fs = require('fs');
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const replaceTemplate =require('./modules/replaceTemplate');
const slugify = require('slugify');
///////////////////////////////////////////
//           FILE
//////////////////////////////////////////
// const textIn = fs.readFileSync('starter/txt/input.txt','utf-8');
// // console.log(textIn);
// // let fin=`This is what we know about avacado ${textIn}\n Created on ${Date.now()}`;
// // console.log(fin);
// // fs.writeFileSync('./starter/txt/output.txt',fin);
// // console.log("File is created");
        //The below code basically reads file name in start.txt(data1) then uses that text to access data2
        //then it reads data3 (append file) and joins data2 and data 3 in a new file final.txt

// fs.readFile('starter/txt/start.txt','utf-8',(err,data1)=>            //Async reading of the file
// {
//     if(err) return console.log("ERROR!!");
//     fs.readFile(`starter/txt/${data1}.txt`,'utf-8',(err,data2)=>
// {
//     console.log(data2);
//     fs.readFile('starter/txt/append.txt','utf-8',(err,data3)=>
// {
//     console.log(data3);
//     fs.writeFile('./starter/txt/final.txt',`${data2} \n ${data3}`,'utf-8',err=>{
//         console.log("Your file has been written");
//     })
// });
// });
// });
// console.log("Will read file");

/////////////////////////////////////////
//            SERVER
//////////z//////////////////////////////
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/card.html`,'utf-8');

/*Used sync model here coz upper code is performed only once so it doesnt interrupt the
overall functionality of the website*/

const DataO =JSON.parse(data);//it gives an object
// writing function
//
const slug=DataO.map(el=>slugify(el.productName,{lower:true}));

console.log(slug);
const server=http.createServer((req,res)=>
{
    //Create the absolute URL. Combine baseurl with relative path(comes from req.url)
    const baseURL = `http://${req.headers.host}`;
    const requestURL = new URL(req.url, baseURL);
    // Get's the relative path requested from the URL. In this case it's /product. 
    const pathname = requestURL.pathname;
    // Get's the query data from the URL. This is ?id=0 We store this in queryURL
    const queryURL = requestURL.search;
    // Remove the ? from the ?id=0 before we make it into an object.
    const parseString = queryURL.substring(1);
    // Parse the query into an object. Our object will be the query variable.
    const query = querystring.parse(parseString);
    //OVERVIEW PAGE
    if(pathname==='/overview'||pathname==='/')      // '/' is for default opening of port 8000
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const cardsHtml= DataO.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    } 
    // PRODUCT PAGE
    else if(pathname==='/product')
    {
        res.writeHead(200,{'Content-type':'text/html'});
        const product=DataO[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
    }
    // API PAGE
    else if(pathname==='/api')
    {
                res.writeHead(200,{'Content-type':'application/json'});
                res.end(data);
    }
    // PAGE NOT FOUND 
    else    //last case to handle error
    {
        res.writeHead(404,{
            'Content-type':'text-html',
            'my-own-header':'hello-world'
        });             //throws an error when we inspect the site 
                        //code 200 means safe state
    res.end('<h1>page not found</h1>');
    }
});



server.listen(8000,'127.0.0.1',()=>                 //127.0.0.1 is the common ip address of the computer
{
    console.log("Listening to request on port 8000");
}
)

