const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const resultDiv = document.getElementById('weatherResult');

function displayWeather(data) {
  const { name, main, weather } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  resultDiv.innerHTML = `
    <h2>${name}</h2>
    <p><img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon" /> ${weather[0].description}</p>
    <p>Temperature: ${main.temp} °C</p>
  `;
}

function fetchWeather(city) {
  if (!city) {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }
  resultDiv.innerHTML = '<p>Loading...</p>';
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function fetchWeatherByCoords(lat, lon) {
  resultDiv.innerHTML = '<p>Loading your location weather...</p>';
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) throw new Error('Location weather not found');
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

// Event listener for manual city input
getWeatherBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  fetchWeather(city);
});

// Geolocation on page load
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        resultDiv.innerHTML = '<p>Geolocation permission denied. Please enter a city name.</p>';
      }
    );
  } else {
    resultDiv.innerHTML = '<p>Geolocation is not supported by your browser. Please enter a city name.</p>';
  }
});
