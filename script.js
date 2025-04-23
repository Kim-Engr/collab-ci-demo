const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  const resultDiv = document.getElementById('weatherResult');

  if (!city) {
    resultDiv.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  resultDiv.innerHTML = '<p>Loading...</p>';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      const { name, main, weather } = data;
      const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
      resultDiv.innerHTML = `
        <h2>${name}</h2>
        <p><img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon" /> ${weather[0].description}</p>
        <p>Temperature: ${main.temp} °C</p>
      `;
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
