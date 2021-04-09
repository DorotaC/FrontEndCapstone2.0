const fetch =require ('node-fetch')

//setting to hide API credentials
const dotenv = require('dotenv');
dotenv.config();
//apiKey = '${process.env.API_KEY}';

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Middleware*/
//Configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initializing the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;

const server = app.listen(port, listening);
function listening(){
  console.log(`running on localport ${port}`);
}

//nowy fragment
app.get('/', function(req, res){
  res.sendFile('dist/index.html')
})

app.post('/getLocation', async (req, res) => {
  //const apiURL = `https://api.openweathermap.org/data/2.5/weather?zip=${req.body.uInput}&appid=${process.env.API_KEY}&units=imperial`
  const apiURL = `http://api.geonames.org/searchJSON?q=${req.body.uInput}&maxRows=10&username=${process.env.GEO_USERNAME}`
  const apiResponse = await fetch(apiURL);
  try {
    const weatherData = await apiResponse.json();
    //return weatherData;
    res.send(weatherData)
  } catch(error) {
    console.log('error', error);
  };
})

//GET route that return projectData object
app.get('/all', sendData);

function sendData(req, res) {
  res.send(projectData);
  console.log("Got a GET request for the all route");
}

//POST route that adds incoming data to projectData object
 app.post('/cityData', function(req, res){
   console.log(req.body);
   projectData.cityName = req.body.cityName;
   projectData.country = req.body.country;
   projectData.tripDate = req.body.tripDate;
   projectData.daysToTrip = req.body.daysToTrip;
   console.log("Got a POST request for the weather route");
 })
