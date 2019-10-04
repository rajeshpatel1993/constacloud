const http = require('http');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');


const rootDir = require('./util/path');

const shopController = require('./controllers/home');

const app = express();

const fileStorage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null, 'csvs');
  },
  filename:(req,file,cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'text/csv' 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.set('view engine', 'ejs');
app.set('views', 'views');


const homeRoutes = require('./routes/home');

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage, fileFilter:  fileFilter}).single('csvfile'));
app.use(express.static(path.join(__dirname,'public')));


app.use(homeRoutes);

app.listen(3000, (err,su)=>{
    console.log(`app listening`);
});