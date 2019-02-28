var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
var busboy = require('connect-busboy');
var fs = require('fs');
var multer = require('multer');
var formidable = require('formidable');
var upload = multer({dest:'public/uploads/'});

var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const port = 3000;

//your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// For http
httpServer.listen(8080);
// For https
httpsServer.listen(8443);

// app.get('/', function (req, res) {
//   res.header('Content-type', 'text/html');
//   return res.end('<h1>Hello, Secure World!</h1>');
// });

app.listen(port, function () {
  console.log("Server is running on "+ port +" port");
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use(cookieParser())
app.use(cors())
app.use(fileUpload())
app.use(busboy());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// app.get('/hi', function (req, res) {
//   res.send('<b>My</b> first express http server');
// });

app.post('/upload', (req,res,next) => {
  let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  uploadFile.mv(
    `${__dirname}/public/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }

      res.json({
        file: `public/${req.files.file.name}`,
      })
    }
  )
})

// app.route('/upload')
//     .post(function (req, res, next) {

//         var fstream;
//         req.pipe(req.busboy);
//         req.busboy.on('file', function (fieldname, file, filename) {
//             console.log("Uploading: " + filename);

//             //Path where image will be uploaded
//             fstream = fs.createWriteStream(__dirname + '/public/images/' + filename);
//             file.pipe(fstream);
//             fstream.on('close', function () {    
//                 console.log("Upload Finished of " + filename);              
//                 res.redirect('back');    
//                 res.json({
//                   file:filename
//                 })       //where to go next
//             });
            
//         });
//     });

// app.post('/upload', upload.any(), function(req,res,next){
//   res.send(req.files);
// })

app.get('/', function (req, res){
  res.sendFile(__dirname + '/upload.html');
});

app.post('/', function (req, res){
  var form = new formidable.IncomingForm();
  
  form.parse(req);

  let dir = __dirname +'/upload';
  if (!fs.existsSync(dir)){
      console.log('Folder Created!')
      fs.mkdirSync(dir);
  }
  console.log(req);

  form.on('fileBegin', function (name, file){
      file.path = __dirname +'/upload/'+ file.name;
  });

  form.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
  });
  console.log(__dirname);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Files Uploaded</h1>');
  res.write('<a href="/">Back</a>');
  return res.end();
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
