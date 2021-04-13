const fetch =require ('node-fetch')

//settings to hide API credentials
const dotenv = require('dotenv');
dotenv.config();

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

app.get('/', function(req, res){
  res.sendFile('dist/index.html');
})

//chainging APIs: Geonames, Weatherbit, Pixabay
app.post('/getLocation', async (req, res) => {
  try {
    //fetching data from Geonames
    const apiURLGeonames = `http://api.geonames.org/searchJSON?q=${req.body.uInput}&maxRows=10&username=${process.env.GEO_USERNAME}`;
    const apiResponseGeonames = await fetch(apiURLGeonames);
    const cityDataGeonames = await apiResponseGeonames.json();
    //if there is no place/city corresponding to the user input, send message to the client side
    if (cityDataGeonames.totalResultsCount === 0) {
      message = 'This place does not exist in Geonames database. Plase choose another destination';
      res.send({message: message});
      //if everything is fine, chain weatherbit
    } else {
        const latitude = cityDataGeonames.geonames[0].lat;
        const longitude = cityDataGeonames.geonames[0].lng;
        const cityName = cityDataGeonames.geonames[0].name;
        const country = cityDataGeonames.geonames[0].countryName;
        const apiURLWeatherbit = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`;
        const apiResponseWeatherbit = await fetch(apiURLWeatherbit);
        const cityDataWeatherbit = await apiResponseWeatherbit.json();
        //chaining Pixabay - has to be 'let', to change for country search if needed (in case of no hits)
        let apiURLPixabay = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${cityName}&image_type=photo`
        let apiResponsePixabay = await fetch(apiURLPixabay)
        let cityDataPixabay = await apiResponsePixabay.json();
        //if there are no hit for requested city, search for country photos
        if (cityDataPixabay.totalHits === 0) {
          apiURLPixabay = `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${country}&image_type=photo`
          apiResponsePixabay = await fetch(apiURLPixabay)
          cityDataPixabay = await apiResponsePixabay.json();
        }
        //prepare final data object to be send to client side
        cityData = {
          cityName: cityDataGeonames.geonames[0].name,
          country: cityDataGeonames.geonames[0].countryName,
          lowTempCurrent: cityDataWeatherbit.data[0].low_temp,
          maxTempCurrent: cityDataWeatherbit.data[0].max_temp,
          cloudsCurrent: cityDataWeatherbit.data[0].weather.description,
          lowTempForecast: cityDataWeatherbit.data[15].low_temp,
          maxTempForecast: cityDataWeatherbit.data[15].max_temp,
          cloudsForecast: cityDataWeatherbit.data[15].weather.description,
          photo: cityDataPixabay.hits[0].webformatURL,
        }
        res.send(cityData);
    }
  } catch(error) {
    console.log('error', error);
   };
  console.log("Got a POST request for the getLocation route");
})

//GET route that return projectData object
app.get('/all', sendData);

function sendData(req, res) {
  res.send(projectData);
  console.log("Got a GET request for the all route");
}

//POST route that adds incoming data to projectData object
 app.post('/cityData', function(req, res){
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
   projectData.photo = req.body.photo;
   console.log("Got a POST request for the cityData route");
 })
