const fs = require("fs");
let name = "./convertedFiles/sample.docxWed Feb 27 2019content.txt";
fs.readFile(name, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + name);
    
    let text = data.replace(/<(?:.|\n)*?>/gm, ' ');
    console.log(data);
    console.log(text);
  
    


})