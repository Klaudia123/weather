const appKey = "43b67696b6acfc6f1caabf39a543e935";

let nav = document.getElementsByTagName("nav")[0];
let searchButton = document.getElementById("search-btn");
let searchInput = document.getElementById("search-txt");
let hamburger = document.getElementById("hamburger");

let falconCities = ['Copenhagen', 'New York', 'Berlin', 'Budapest', 'Sofia', 'Melbourne'];
let newCities = [];

searchButton.addEventListener("click", findWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);
hamburger.addEventListener("click", toogleHamburger);

function enterPressed(event) {
  if (event.key === "Enter") {
    findWeatherDetails();
  }
}

(function findFalconWeather() {
    for (let i = 0; i < falconCities.length; i++) {
        const city = falconCities[i];

        // call weather service
        let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appKey;
        let position = {'section': document.getElementById("falconCities"), 'lineUp': 'beforeend', 'cityType': 'falcon'};
        httpRequestAsync(searchLink, theResponse, position);
    }
    getLsCities();
})();

function findWeatherDetails() {
    if (searchInput.value === "") {
        // err 
    } else {
        let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&appid="+appKey;
        let position = {'section': document.getElementById("newCities"), 'lineUp': 'afterbegin', 'cityType': 'new'};
        httpRequestAsync(searchLink, theResponse, position);
    }
}

function theResponse(response, position) {
    let jsonObject = JSON.parse(response);
    constructCityDiv(jsonObject, position);
}

function constructCityDiv(jsonObject, position){  
    // remove spaces
    let cityName = jsonObject.name.replace(/\s/g, '');

    let weather = getIcon(jsonObject.weather[0].main);

    // construct city div
    let cityDetails = `
        <div id="`+ cityName +`" class="cityContainer `+ weather +`Bg">
            <div>
                <div class="weatherInfo">
                    <p class="col temp">`+ parseInt(jsonObject.main.temp - 273) +`°</p>
                    <p class="col weatherName">`+ weather +`</p>
                    <p class="col humidity">Humidity `+ jsonObject.main.humidity +` %</p>
                    <p class="col">Wind speed `+ jsonObject.wind.speed +` m/s</p>
                </div>
                <div class="container">
                    <div class="`+ weather +`"></div> 
                </div>
            </div> 
            <h2 id="city-name">`+ jsonObject.name +`</h2>
        </div>`;
    
    // append city
    position.section.insertAdjacentHTML(position.lineUp, cityDetails);
    
   if(position.cityType == 'falcon'){
        // create nav link
        let navLink = `<a href="#`+ cityName +`">`+ cityName +`</a>`;
        nav.insertAdjacentHTML('beforeend', navLink);
    } else {
        // new city
        configNewCity(jsonObject);
    }
}

function configNewCity(jsonObject){
    // remove spaces
    let cityName = jsonObject.name.replace(/\s/g, '');

    // find city index
    const cityIndex = newCities.findIndex(nC => nC.name === cityName);
    if (cityIndex == -1){
        // add city to the list
        newCities.push(jsonObject);
        saveObjInLS(newCities);
    }

    // add remove btn
    let removeBtn = `<button class="delBtn" data-index="`+ cityIndex +`">remove</button>`;
    let city = document.getElementById(cityName);
    city.insertAdjacentHTML('afterbegin', removeBtn);
    
    // add remove btn listener
    let delBtns = document.getElementsByClassName("delBtn");

    for (let i = 0; i < delBtns.length; i++) {
        delBtns[i].addEventListener("click", deleteCity, false);
    }
    
    // scroll to new city
    document.getElementById(cityName).scrollIntoView();
    
}

function httpRequestAsync(url, callback, position) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4) {
            if ( httpRequest.status == 200) {
                callback(httpRequest.responseText, position);
                searchInput.value = "";
            } else {
                alert('Invalid city name. Try again :)');
            }
        }
    }
    httpRequest.open("GET", url, true); // true for asynchronous 
    httpRequest.send();
}

function deleteCity(e){
    let delBtn = e.target;
    let index = delBtn.dataset.index;
    
    let delDiv = delBtn.parentNode;
    delDiv.style.display = "none";

    newCities.splice(index, 1);
    saveObjInLS(newCities);
}

function saveObjInLS(newCities){
    let strCities = JSON.stringify(newCities)
    localStorage.setItem("yourCities", strCities);
}

function toogleHamburger() {
    nav.classList.toggle("change");
}

function getIcon(weather){
    switch (weather.toLowerCase()) {
        case 'atmosphere':
        case 'clouds':
        case 'drizzle':
            return 'cloudy';
        case 'clear':
            return 'sunny';
        case 'rain':
            return 'rainy';
        case 'thunderstorm':
            return 'stormy';
        case 'snow':
            return 'snowy';
        default:
            return 'rainbow';
    }
}

function getLsCities(){
    let strCities = localStorage.getItem('yourCities');
    if ( strCities != null ){
        let lsCities = JSON.parse(strCities);

        for (let i = 0; i < lsCities.length; i++) {
            let lsCity = lsCities[i];
            
            newCities.push(lsCity);
            
            let position = {'section': document.getElementById("newCities"), 'lineUp': 'afterbegin', 'cityType': 'new'};
            constructCityDiv(lsCity, position);
        }
    }

}