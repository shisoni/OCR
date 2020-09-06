const express = require('express');
const multer = require('multer');
const BodyParser = require("body-parser");
const app = express();
const fs = require('fs');
const CONNECTION_URL = "mongodb+srv://shisoni:shisoni@lootkamaal-wbiet.mongodb.net/test";
const MongoClient = require("mongodb").MongoClient;
const http = require("http");
const mongoose = require('mongoose');
const DATABASE_NAME = "OCR";
var Tesseract = require('tesseract.js');
const FileType = require('file-type');
var PDFImage = require("pdf-image").PDFImage;
const path = require('path');
const pdf = require('pdf-poppler');
 


//middlewares
app.set('view engine', 'ejs');
// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());

const PORT = process.env.PORT | 8080;

const server = http.createServer(app);

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var Schema = mongoose.Schema;

var imageDataSchema = new Schema({
   imageText : {type: String,required : true},
  
});

var ImageData = mongoose.model('ImageData', imageDataSchema);

var database,imageData;

var Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, __dirname + '/images');
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

var upload = multer({
  storage: Storage
}).single('image');
//route
// app.get('/', (req, res) => {
//   res.render('index');
// });

app.post('/api/upload', (req, res) => {

  
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return res.send('Something went wrong');
    }

   
    (async () => {
    var file_type = (await FileType.fromFile(__dirname + '/images/' + req.file.filename)).ext;
    if( file_type == 'pdf')
    {
      let file = __dirname + '/images/' + req.file.filename;
  
  
            let opts = {
              format: 'jpeg',
              out_dir: path.dirname(file),
              out_prefix: path.basename(file, path.extname(file)),
              page: null
          }
           pdf.convert(file, opts)
                      .then(res => {
                        
                          
                      })
                      .catch(error => {
                          console.error(error);
                      })
                      
                  
                      
                      pdf.info(file)
                      .then(pdfinfo => {
                          console.log(pdfinfo);
                      });
                      
                      
                      newName =  opts.out_prefix + '-1.jpg';
    }
  
    else {
      newName =  req.file.filename;
    }
  
    var image = fs.readFileSync(
      __dirname + '/images/' + newName ,
      {
        encoding: null
      }
    );
  
    Tesseract.recognize(image)
  
  
    .then(function(result) {
   
     
      var image_to_text = result.data.text.replace(/\n/g," ");
      console.log(image_to_text);
      res.send(image_to_text);
      var obj = { imageText : image_to_text};
      imageData.insertOne(obj,function(err,res){
        if(err) throw err;
        console.log("1 document inserted");
      });
  
    });
   
  })();

 
    });
   
  });

  


app.get('/api/showdata', (req, res) => {

  imageData.find({}).sort({_id:-1}).limit(1).
  toArray((error, result) => {
    if(error) {
        return res.status(500).send(error);
    }
    res.send(result);
});
});

server.on('listening',function(){
  console.log('ok,server is running');
})

server.listen(8080, () => {
  MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true },{autoIndex: false},{useUnifiedTopology: true,}, (error, client) => {
      if(error) {
          throw error;
      }
      
      database = client.db(DATABASE_NAME);
      imageData = database.collection("ImageData");
      console.log("Connected to `" + DATABASE_NAME + "`!");

    });

  });
