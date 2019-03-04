var watch = require('node-watch');
var folder = '/Users/Admin/Desktop/BackEnd/projectBack/upload/';
var folder2 = '/Users/Admin/Desktop/BackEnd/projectBack/convertedFiles/';
const fs = require("fs");

if (!fs.existsSync(folder2)){
    console.log('Folder Created!')
    fs.mkdirSync(folder2);
}
watch(folder, { recursive: true }, function (evt, name) {
    console.log('%s changed.', name);
    let filename = name.substring(folder.length);
  
    let txtfile = folder2 + filename + ".txt";
    const fs = require("fs");
    if (evt == 'update') {
        if (name.endsWith(".docx")) {
            docxToText(name, txtfile);
            fs.unlinkSync(name);

            // mammoth.extractRawText({path: name})
            // .then(function(result){
            //     var text = result.value; // The raw text
            //     var messages = result.messages;
            //     fs.writeFile(txtfile, text, function (err) {
            //         if (err) throw err;
            //         console.log("Saved!");
            //     })
            // })
            // .done();
        }

        if (name.endsWith(".pdf")) {
            pfdToTxt(name, txtfile);
            if (!fs.existsSync(name)){
                fs.unlinkSync(name);
            }
            
        }

        if (name.endsWith(".xlsx")) {
            xlsxToTxt(name, txtfile);
            fs.unlinkSync(name);
        }
    }
});

function docxToText(name,txtfile) {
    const fs = require("fs");
    var mammoth = require("mammoth");

    mammoth.convertToHtml({ path: name })
        .then(function (result) {
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            fs.writeFile(txtfile, html, function (err) {
                if (err) throw err;
                console.log("Docx Converted");
            })
        })
        .done();
    // let fname = name.substring(folder.length);
    // let newloc = folder2 + fname;

    // fs.rename(name, newloc,function(err){
    //     if(err) throw err;
    //     console.log("Docx file moved");
    // })

}

function pfdToTxt(name, txtfile) {
    const fs = require("fs");
    const pdf = require('pdf-parse');

    let dataBuffer = fs.readFileSync(name);

    pdf(dataBuffer).then(function (data) {

        // // number of pages
        // console.log("pages: " + data.numpages);
        // // number of rendered pages
        // console.log(data.numrender);
        // // PDF info
        // console.log("PDF info :" + data.info);
        // // PDF metadata
        // console.log("metadata: " + data.metadata);
        // // PDF.js version
        // // check https://mozilla.github.io/pdf.js/getting_started/
        // console.log(data.version);
        // // PDF text
        // console.log("content: " + data.text);
        // let filename = name.substring(folder.length);
  
        // let change = folder + filename + ".txt";
        createDocx(txtfile,data.text);
        // fs.writeFile(change, data.text, function (err) {
        //     if (err) throw err;
        //     console.log("PDF Converted !");
        //      createDocx(txtfile,data.text);
        //      fs.unlinkSync(name)
        // })
    });
   // let fs = require('fs'),
//     PDFParser = require("pdf2json");

// let pdfParser = new PDFParser();

// pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
// pdfParser.on("pdfParser_dataReady", pdfData => {
//     fs.writeFile(txtfile, JSON.stringify(pdfData));
// });

// pdfParser.loadPDF(name);


}


function xlsxToTxt(name, txtfile) {
    var XLSX = require('xlsx')
    var workbook = XLSX.readFile(name);
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    const fs = require("fs");
    let xlText = JSON.stringify(xlData);
    fs.writeFile(txtfile, xlText, function (err) {
        if (err) throw err;
        console.log("Xlsx Converted!");
    })
}

function createDocx(txtfile,text){
    let docx = require('docx');

    let doc = new docx.Document();

    var paragraph = new docx.Paragraph();
    paragraph.addRun(new docx.TextRun(text));
    doc.addParagraph(paragraph);


    let packer = new docx.Packer();
    packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync((txtfile.substring(0,txtfile.length-4)+".docx"), buffer)
    })
};