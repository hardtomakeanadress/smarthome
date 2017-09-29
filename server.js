var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var fs         = require('fs'); 
var moment     = require('moment');
var app        = express();
var port       = 80;

var rawdata_file = fs.readFileSync('db.json');
var database     = JSON.parse(rawdata_file);

// set the view engine to ejs
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/figure', (req, res) => {
  var id      = req.query.id;
  res.render(String(id), {values: database.temperature});
})

app.post('/post', (req, res) => {
  postRequestHandler(req, res);  
});

function saveData(req, error) {
  var dateTime    = moment().format();
  var temperature = req.body.temperature;
  var humidity    = req.body.humidity;
  var voltage     = req.body.voltage;
  var rawData     = 
    {
      "datetime" : dateTime,
      "error": error,
      "temperature": temperature,
      "humidity": humidity,
      "voltage": voltage
    }
  var data = JSON.stringify(rawData);

  fs.writeFileSync('db.json', data);
}

function validateData(req) {
  var error = false;
  if (req.body.temperature <=   60 &&
      req.body.humidity    <=  100 &&
      req.body.voltage      < 4.35 ) {
    error = false;
  }
  else {
    error = true;
  }
  return error;
}

function postRequestHandler(req, res) {
  var responseCode = "400";
  var error        = validateData(req);
  if (!error) {
    saveData(req);
    responseCode = "200";
  }
  res.send(responseCode);
}

app.listen(port);