// API configuration
const API_KEY = 'f00c38e0279b7bc85480c3fe775d518c';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationElement = document.getElementById('location');
const dateElement = document.getElementById('date');
const weatherIcon = document.getElementById('weather-icon');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const windSpeedElement = document.getElementById('wind-speed');
const humidityElement = document.getElementById('humidity');
const feelsLikeElement = document.getElementById('feels-like');
const pressureElement = document.getElementById('pressure');
const weatherInfo = document.getElementById('weather-info');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    getWeatherData('London');
});

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

// Get weather data from API
async function getWeatherData(city) {
    try {
        showLoading();
        hideError();
        
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'City not found');
        }
        
        displayWeatherData(data);
        updateBackground(data.main.temp);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display weather data
function displayWeatherData(data) {
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    dateElement.textContent = formatDate(new Date());
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionElement.textContent = capitalizeFirstLetter(data.weather[0].description);
    
    // Update weather details
    windSpeedElement.textContent = `${data.wind.speed} m/s`;
    humidityElement.textContent = `${data.main.humidity}%`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressureElement.textContent = `${data.main.pressure} hPa`;
    
    // Show weather info
    weatherInfo.style.display = 'block';
}

// Helper functions
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function updateBackground(temperature) {
    let color1, color2;
    
    if (temperature < 0) {
        // Very cold (blue)
        color1 = '#1e90ff';
        color2 = '#00bfff';
    } else if (temperature < 10) {
        // Cold (blue to green)
        color1 = '#00bfff';
        color2 = '#00ced1';
    } else if (temperature < 20) {
        // Mild (green to yellow)
        color1 = '#00ced1';
        color2 = '#32cd32';
    } else if (temperature < 30) {
        // Warm (yellow to orange)
        color1 = '#32cd32';
        color2 = '#ffa500';
    } else {
        // Hot (orange to red)
        color1 = '#ffa500';
        color2 = '#ff4500';
    }
    
    document.body.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
}

// UI state functions
function showLoading() {
    loadingElement.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    errorElement.textContent = message || 'Failed to fetch weather data';
    errorElement.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function hideError() {
    errorElement.style.display = 'none';
}