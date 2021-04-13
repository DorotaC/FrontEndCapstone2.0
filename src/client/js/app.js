// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'/'+ d.getDate()+'/'+ d.getFullYear();

//Function used to generate event listener after DOM is loaded (check index.js)
function init() {
  const generateButton = document.getElementById('generate');
  generateButton.addEventListener('click', generateAndPost);
}

//Main function that gets data from API as well as user data and dynamically update UI
function generateAndPost(event) {
  const cityField = document.getElementById('city');
  const tripDateRaw = document.getElementById('tripDate');
  const tripDate = new Date(tripDateRaw.value);

  //checking if city name is valid. If it is, then date format is checked. If everything is ok, app proceeds.
  if (cityField.validity.patternMismatch || cityField.value == ''){
    alert('City name is not correct. Only latin letters and dash symbol are accepted \'\-\'.');
    } else if (tripDateRaw == '' || (tripDate < d) || tripDateRaw.validity.patternMismatch) {
      alert('Date is not correct. Correct format is MM/DD/YYYY. You cannot plan departure earlier than tommorow');
    } else {
        const city = cityField.value;
        //Number of days to wait for the trip is calculated, based on value from user input
        const tripDateRefined = (tripDate.getMonth()+1)+'/'+ tripDate.getDate()+'/'+ tripDate.getFullYear();
        const daysToTrip = Math.ceil((tripDate.getTime() - d.getTime())/(1000 * 3600 * 24));
        //city name from user input is send to server side to get through all the APIs. As a result, app data is received.
        Client.postHandler('/getLocation', {uInput: city})
         .then(function(cityData){
           //in case no city/place was found in Geonames database, an alert will appear.
           if ('message' in cityData){
             alert(cityData.message);
           } else {
             //complete city data are being send to appear on the website as a 'most recent entry'
             Client.postHandler('/cityData', {cityName: cityData.cityName,
                                             country: cityData.country,
                                             lowTempCurrent: cityData.lowTempCurrent,
                                             lowTempForecast: cityData.lowTempForecast,
                                             maxTempCurrent: cityData.maxTempCurrent,
                                             maxTempForecast: cityData.maxTempForecast,
                                             cloudsCurrent: cityData.cloudsCurrent,
                                             cloudsForecast: cityData.cloudsForecast,
                                             tripDate: tripDateRefined,
                                             daysToTrip: daysToTrip,
                                             photo: cityData.photo});
          }
        })
        //function that make city/trip data appear on the screen
        .then(function() {
          updateUI()
          });
    }
}

//function that dynamically update UI
const updateUI = async () => {
  const req = await fetch('/all');
  try {
    const reqData = await req.json();
    document.getElementById('cityName').innerHTML = reqData.cityName;
    document.getElementById('country').innerHTML = reqData.country;
    document.getElementById('date').innerHTML = reqData.tripDate;
    document.getElementById('daysToTrip').innerHTML = reqData.daysToTrip;
    if (reqData.daysToTrip <= 7) {
        document.getElementById('lowTemp').innerHTML = reqData.lowTempCurrent;
        document.getElementById('maxTemp').innerHTML = reqData.maxTempCurrent;
        document.getElementById('clouds').innerHTML = reqData.cloudsCurrent;
    } else {
        document.getElementById('lowTemp').innerHTML = reqData.lowTempForecast;
        document.getElementById('maxTemp').innerHTML = reqData.maxTempForecast;
        document.getElementById('clouds').innerHTML = reqData.cloudsForecast;
    }
    document.getElementById("photo").src = reqData.photo;
  } catch(error) {
    console.log(error);
  }
}

export {
  init,
  generateAndPost,
  updateUI
}
