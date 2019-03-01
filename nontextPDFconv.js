var Tesseract = require('tesseract.js');
var PDFImage = require('pdf-image').PDFImage;



let mypdf = ("./upload/Non-text-searchable.pdf");
// // let myImage = ("C:/Users/Admin/Pictures/Capture.PNG");
// let pdfImage = new PDFImage(mypdf);
// pdfImage.convertPage(0).then(function (imagePath){
//     fs.existsSync(mypdf.substring(0,mypdf.length-4)+".png");
// })


const path = require('path');
const pdf = require('pdf-poppler');
var pdf2image = require('pdf2image');
 
//converts all the pages of the given pdf using the default options 
pdf2image.convertPDF(mypdf, {
    density:600,
    quality:200,
    backgroundColor: '#FFFFFF'
}).then(
    function(pageList){
        console.log(pageList);
    }
);

// let opts = {
//     format: 'jpeg',
//     out_dir:path.dirname(mypdf),
//     out_prefix: path.basename(mypdf, path.extname(mypdf)),
//     page: null
// }

// pdf.convert(mypdf, opts)
//     .then(res => {
//         console.log('Successfully converted');
        
//     })
//     .catch(error => {
//         console.error(error);
//     }) 

    Tesseract.recognize("./upload/Non-text-searchable-1.jpg")
.then(function(result){
    console.log(result.paragraphs);
})