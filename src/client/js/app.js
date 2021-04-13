// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'/'+ d.getDate()+'/'+ d.getFullYear();

function init() {
  const generateButton = document.getElementById('generate');

  generateButton.addEventListener('click', generateAndPost);
}
//Main function that gets data from API as well as user data and dynamically update UI
function generateAndPost(event) {
  const cityField = document.getElementById('city');
  const tripDateRaw = document.getElementById('tripDate');
  const tripDate = new Date(tripDateRaw.value);
  //console.log('pattern mismatch: ' + tripDateRaw.validity.patternMismatch)
  if (cityField.validity.patternMismatch || cityField.value == ''){
    alert('City name is not correct. Only latin letters and dash symbol are accepted \'\-\'.');
    //line below produces error because of Uncaught TypeError: Cannot read property 'patternMismatch' of undefined at HTMLButtonElement.i
    } else if (tripDateRaw == '' || (tripDate < d) || tripDateRaw.validity.patternMismatch) {
    //} else if (tripDateRaw == '' || (tripDate < d)) {
      alert('Date is not correct. Correct format is MM/DD/YYYY. You cannot plan departure earlier than tommorow')
    } else {
    const city = cityField.value;
    const tripDateRefined = (tripDate.getMonth()+1)+'/'+ tripDate.getDate()+'/'+ tripDate.getFullYear();
    const daysToTrip = Math.ceil((tripDate.getTime() - d.getTime())/(1000 * 3600 * 24));
    Client.postHandler('/getLocation', {uInput: city})
     .then(function(cityData){
       console.log("cityData: ")
       console.log(cityData)
       if ('message' in cityData){
         alert(cityData.message)
       } else {
         //Client.postHandler('/weather', {cityName: cityData.main.name, date: newDate, response: response});
         // Client.postHandler('/cityData', {cityName: cityData.geonames[0].name,
         //                                 country: cityData.geonames[0].countryName,
                                         // latitude: cityData.geonames[0].lat,
                                         // longitude: cityData.geonames[0].lng,
                                         // tripDate: tripDateRefined,
                                         // daysToTrip: daysToTrip});
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
     .then(function() {
       updateUI()
      });
       }

  }
//}

//function that dynamically update UI
const updateUI = async () => {
  const req = await fetch('/all');
  try {
    const reqData = await req.json();
    console.log('reqData')
    console.log(reqData);
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
    console.log(photo)
  } catch(error) {
    console.log(error);
  }
}

export {
  init,
  generateAndPost,
  updateUI
}
