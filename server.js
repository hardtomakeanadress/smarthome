var express    = require('express'),
    path       = require('path'),
    bodyParser = require('body-parser'),
    fs         = require('fs'),
    moment     = require('moment'),
    app        = express(),
    port       = 80;



// set the view engine to ejs
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/figure', (req, res) => {
	var id       = req.query.id,
		database = getData(database);
		room     = getRoom(id);
  //by id, it should be a function that retrives from db , that particular room status().
  //rooms are diferent, so we replace the rendered information with a particular room object;
  // every room should have own databse.

	// getRoom(id);        res.render(String(id), room) 

	res.render(String(id), {temperature: database.temperature,
                            humidity: database.humidity,
                            voltage: database.voltage,
                            datetime: database.datetime});
});

app.post('/post', (req, res) => {
	postRequestHandler(req, res);  
});

function saveData(req, error) {
	var dateTime    = moment().format('h:mm:ss a, Do MMMM'),
      	temperature = req.body.temperature,
  	  	humidity    = req.body.humidity,
      	voltage     = req.body.voltage,
      	rawData     = {
      		"datetime" : dateTime,
      		"error": error,
      		"temperature": temperature,
      		"humidity": humidity,
      		"voltage": voltage
    	};
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
};

function postRequestHandler(req, res) {
	var responseCode = "400",
    	error        = validateData(req);
  	if (!error) {
    	saveData(req);
    	responseCode = "200";
  	}
  	res.send(responseCode);
}

function getData(database) {
	var rawdata_file = fs.readFileSync('db.json'),
  		database     = JSON.parse(rawdata_file);
  	return database;
}

function getRoom(roomId) {

}

app.listen(port);