const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Adding feature of location access
window.addEventListener('load', async () => {
    try {
        const position = await getCurrentPosition();
        gotLocation(position);
    } catch (error) {
        failedToGet();
    }
});

// Adding feature of pressing Enter
document.addEventListener("keypress", async function(event) {
    if (event.key === "Enter") {
        const city = inputBox.value.trim();
        if (city) {
            checkWeather(city);
        }
    }
});

// Function to get current position (latitude and longitude)
async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Function to handle successful location retrieval
async function gotLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    checkWeatherByCoords(lat, lon);
}

// Function to handle unsuccessful location retrieval
function failedToGet() {
    console.log('Failed to retrieve location.');
}

// Function to fetch weather data using coordinates
async function checkWeatherByCoords(lat, lon) {
    const api_key = "8fea84e862e6df0ce1408336b6756dc2"; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const weather_data = await fetch(url).then(response => response.json());

    if (weather_data.cod === "404") {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        return;
    }

    updateWeatherUI(weather_data);
}

// Function to fetch weather data using city name
async function checkWeather(city) {
    const api_key = "8fea84e862e6df0ce1408336b6756dc2"; // Replace with your API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(url).then(response => response.json());

    if (weather_data.cod === "404") {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        return;
    }

    updateWeatherUI(weather_data);
}

// Function to update the weather UI elements
function updateWeatherUI(weather_data) {
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

    switch (weather_data.weather[0].main) {
        case "Clouds":
            weather_img.src = "/assets/cloud.png";
            break;
        case "Clear":
            weather_img.src = "/assets/clear.png";
            break;
        case "Rain":
            weather_img.src = "/assets/rain.png";
            break;
        case "Mist":
            weather_img.src = "/assets/mist.png";
            break;
        case "Snow":
            weather_img.src = "/assets/snow.png";
            break;
    }
}

// Adding event listener to the search button
searchBtn.addEventListener('click', () => {
    const city = inputBox.value.trim();
    if (city) {
        checkWeather(city);
    }
});
