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
  const apiURLGeonames = `http://api.geonames.org/searchJSON?q=${req.body.uInput}&maxRows=10&username=${process.env.GEO_USERNAME}`
  const apiResponseGeonames = await fetch(apiURLGeonames);
  try {
    const cityDataGeonames = await apiResponseGeonames.json();
      {
        const latitude = cityDataGeonames.geonames[0].lat;
        const longitude = cityDataGeonames.geonames[0].lng;
        console.log('latitude: ' + cityDataGeonames.geonames[0].lat)
        console.log('longitude: ' + cityDataGeonames.geonames[0].lng)
        const apiURLWeatherbit = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`
        const apiResponseWeatherbit = await fetch(apiURLWeatherbit)
        //doesn't work with const
        //const cityDataWeatherbit = await apiResponseWeatherbit.json();
        //works with var
        var cityDataWeatherbit = await apiResponseWeatherbit.json();
  }
  cityData = {
    cityName: cityDataGeonames.geonames[0].name,
    country: cityDataGeonames.geonames[0].countryName,
    lowTempCurrent: cityDataWeatherbit.data[0].low_temp,
    maxTempCurrent: cityDataWeatherbit.data[0].max_temp,
    cloudsCurrent: cityDataWeatherbit.data[0].weather.description,
    lowTempForecast: cityDataWeatherbit.data[15].low_temp,
    maxTempForecast: cityDataWeatherbit.data[15].max_temp,
    cloudsForecast: cityDataWeatherbit.data[15].weather.description,
  }
    console.log(cityData)
    res.send(cityData)
  } catch(error) {
    console.log('error', error);
   };
  console.log("Got a POST request for the getLocation route");
})

// app.get('/wetherbit', async (req, res) => {
//   const apiURL = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${req.body.latitude}&lon=${req.body.longitude}&key=${process.env.WEATHERBIT_KEY}`
//   console.log("Got a GET request for the wetherbit route");
//   console.log(req.body);
//   const apiResponse = await fetch(apiURL);
//   try {
//     const weatherData = await apiResponse.json();
//     //return weatherData;
//     res.send(weatherData)
//   } catch(error) {
//     console.log('error', error);
//   };
// })

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
   projectData.lowTempCurrent = req.body.lowTempCurrent;
   projectData.lowTempForecast = req.body.lowTempForecast;
   projectData.maxTempCurrent = req.body.maxTempCurrent;
   projectData.maxTempForecast = req.body.maxTempForecast;
   projectData.cloudsCurrent = req.body.cloudsCurrent;
   projectData.cloudsForecast = req.body.cloudsForecast;
   console.log("Got a POST request for the cityData route");
 })
