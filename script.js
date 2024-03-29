const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorDisplay=document.querySelector("[data-error]");

const API_KEY="e53f8a5db704793aa1141ceb2d81e2ba";
let currTab=userTab;
currTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currTab){
        currTab.classList.remove("current-tab");
        currTab=clickedTab;
        currTab.classList.add("current-tab");
        errorDisplay.classList.remove("active");

    }

    if(!searchForm.classList.contains("active")) {
        //kya search form wala container is invisible, if yes then make it visible
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        errorDisplay.classList.remove("active");
        searchForm.classList.add("active");
    }
    else {
        //main pehle search wale tab pr tha, ab your weather tab visible karna h 
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorDisplay.classList.remove("active");
        //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
        //for coordinates, if we haved saved them there.
        getfromSessionStorage();
    }

}

userTab.addEventListener('click',()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});


//check if cordinates are already present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //If local coordinates not found
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

};

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        console.log("Error in fetching weather info",err);

    }

};

function renderWeatherInfo(weatherInfo) {
    //fistly, we have to fethc the elements 

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
};

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // show an alert for no gelolocation support available
        alert("No geolocation support available");
    }
};


function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

};

const grantAccessButton = document.querySelector("[data-grant-access]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;


    if(cityName ==="")
    {
        return ;
    }
     else{

    fetchSearchWeatherInfo(cityName);

      
     }


   
});
async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    errorDisplay.classList.remove("active");
  
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      
      if (!data.sys) {
        throw data;
      }
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      errorDisplay.classList.remove("active");

      renderWeatherInfo(data);
    } catch (error) {
      loadingScreen.classList.remove("active");
      errorDisplay.classList.add("active");
      console.log("City not found", error);
    }
  }
  





