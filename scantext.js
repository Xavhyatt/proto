var watch = require('node-watch');
const fs = require("fs");
const fetch = require('node-fetch');
const PDFDocument = require('pdfkit');
let buzzwordAPI = "http://52.142.150.170:3000/keywords/getall";



// const request = async (data,name) => {
//     fetch(buzzwordAPI)
//     .then(response => response.text())
//     .then(words => 
        
//         scanText(data,words,name))
//         .catch((error) => {
//             console.log(error);
//         });
        
// }

var folder = './convertedFiles/';
let suffixrmv;
watch(folder, { recursive: true }, function (evt, name) {
    if (evt == 'update') {
         if(name.endsWith(".txt")){
        suffixrmv = 4; 
        }
        if(name.endsWith(".docx")){
            suffixrmv = 5;
        }
        
    fs.readFile(name, 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: ' + name);
    
        let filename = name.substring(folder.length-2,name.length-4);
      
        //request(data, filename);
        let words = ["lodash"];
         scanText(data,words,filename)
         fs.unlinkSync(name);
    
        
    })

    }
})

function scanText(text, buzzwords, name){
    let date = require('date-and-time');
    let now = new Date();
    date.format(now, 'DD/MM/YYYY HH:mm:ss');

    let taglessText = text.replace(/<(?:.|\n)*?>/gm, ' ');


    let wordArray = taglessText.split(" ");
    let wordcount = 0;
    wordArray.forEach(function(ele){
        if(ele.length > 0){
         wordcount ++; 
        }
    })
  
    let lowerText = taglessText.toLowerCase();
    var wordcnt = lowerText.replace(/[^\w\s]/g, " ").split(/\s+/).reduce(function(map, word){
        map[word] = (map[word]||0)+1;
        return map;
    }, Object.create(null));
  
    let definite =[];
    let maybe = [];
    let keys = Object.keys(wordcnt);
    // buzzwords = JSON.parse(buzzwords);
    

    buzzwords.forEach(function(element){
    for(i=0 ; i<keys.length ; i++){
        if(keys[i]===element){
            let flag = {"Word": element,
                        "Frequency" : wordcnt[element]}
            // let flag = {[element]: wordcnt[element]}
             definite.push(flag);
        }
        if(keys[i].includes(element)){
            let flag = {"Word": keys[i],
            "Frequency" : wordcnt[keys[i]]}
            //let flag = {[keys[i]]: wordcnt[keys[i]]}
            maybe.push(flag);
            
        }
    }    
})
// var results = [];
// for(var i = 0; i < words.length; i++) {
//     if ((new RegExp("\\b" + words[i] + "\\b", "i").test(text))) {
//         results.push(words[i]);
//     }
// }
let definiteRes = {"Exact matches": definite};


let maybeRes = {"Partial Matches" : maybe};
//   console.log("Name of File: " + name);
//   console.log("word count: " + wordcount);
//   console.log("Number of Threat words found: " + definite.length);
//   console.log(definiteRes);
//   console.log(maybeRes);
  let json = {"nameOfFile" : name, "TimeOfScan" : now,
  "wordCount" : wordcount, "numberOfThreatWordsFound": definite.length, "exactMatches": definite,
  "partialMatches":maybe};
  let dir = __dirname +'/reports';
  if (!fs.existsSync(dir)){
      console.log('Folder Created!')
      fs.mkdirSync(dir);
  }
  let fileloc = './reports/' + name.substring(folder,name.length-suffixrmv) + ".json";


console.log(json);
 
   fs.writeFile(fileloc, JSON.stringify(json), function (err) {
    if (err) throw err;
    console.log("json created");
})
const doc = new PDFDocument;
var fontkit = require('fontkit');

doc.pipe(fs.createWriteStream('./reports/'+name+" Report.pdf"));

doc.image('./Picture2.jpg', 50 , 0, {
    fit: [150, 150],
    align: 'center',
    valign: 'center',
 });


doc.font('fonts/PalatinoBold.ttf')
   .fontSize(25)
   .text(name + " Report", 100, 100);

   doc.font('fonts/PalatinoBold.ttf')
   .fontSize(15)
   .text('Scan Date: ' + now , 100, 160);

   doc.font('fonts/PalatinoBold.ttf')
   .fontSize(15)
   .text('Number of Threat Words Found: ' + definite.length , 100, 200);

   doc.font('fonts/PalatinoBold.ttf')
   .fontSize(15)
   .text('Exact Matches: ' + JSON.stringify(definite) , 100, 240);

   doc.font('fonts/PalatinoBold.ttf')
   .fontSize(15)
   .text('Partial Matches: ' + JSON.stringify(maybe) , 100, 280);

    

   doc.end();
}





