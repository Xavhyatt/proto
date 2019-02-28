var Tesseract = require('tesseract.js');
var PDFImage = require('pdf-image').PDFImage;



let mypdf = ("C:/Users/Admin/Downloads/Non-text-searchable.pdf");
let myImage = ("C:/Users/Admin/Pictures/Capture.PNG");
// mypdf.convertPage(0).then(function (imagePath){
//     fs.existsSync("/tmp/slide-0.png");
// })

Tesseract.recognize(myImage)
.then(function(result){
    console.log(result.paragraphs);
})