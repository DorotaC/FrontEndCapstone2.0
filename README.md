# Travel App Project - Udacity ND Frontend Capstone

## Overview
This is a simple travel app that checks the weather in the destination
(current for trips planned in the next 7 days, or forecasted for next week for
more distant journeys).

### App uses 3 APIs:
* Geonames to get latitude, longitute, as well as country name based on city name from the user input
  https://www.geonames.org/export/web-services.html
* Weatherbit to get data on current and forecasted (up to 16 days from current date) weather
  https://www.weatherbit.io/api
* Pixabay to get an image of the chosen destination
  https://pixabay.com/api/docs/

### Extend your Project/Ways to Stand Out section
I decided to choose the 2nd option:
Pull in an image for the country from Pixabay API when the enetered location brings up no results
(good for obscure localities).

### Additional information
As required per project requirements, there are two basic JEST test included.
