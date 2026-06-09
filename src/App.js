import React, { useState } from 'react';
import axios from 'axios';
import Forecast from './components/Forecast';
import AIRecommendations from './components/AIRecommendations';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.REACT_APP_WEATHER_KEY;

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setSubmittedCity(city);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const fetchByLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeather(res.data);
          setSubmittedCity(res.data.name);
          setCity(res.data.name);
        } catch (err) {
          setError('Could not fetch weather for your location.');
        }
        setLoading(false);
      },
      () => {
        setError('Location access denied.');
        setLoading(false);
      }
    );
  };

  const getBackground = () => {
    if (!weather) return 'default';
    const condition = weather.weather[0].main;
    if (condition === 'Rain' || condition === 'Drizzle') return 'rainy';
    if (condition === 'Clear') return 'sunny';
    if (condition === 'Snow') return 'snowy';
    if (condition === 'Thunderstorm') return 'stormy';
    if (condition === 'Clouds') return 'cloudy';
    return 'default';
  };

  return (
    <div className={`App ${getBackground()}`}>
      <h1>🌤 Weather App</h1>
      <div className="search-bar">
    <input
    type="text"
    placeholder="Enter a city..."
    value={city}
    onChange={(e) => setCity(e.target.value)}
    onKeyPress={handleKeyPress}
  />
  <button onClick={fetchWeather}>Search</button>
  <button onClick={fetchByLocation}>📍 My Location</button>
</div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p>{weather.weather[0].description}</p>
          <div className="details">
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌬 Wind: {weather.wind.speed} m/s</p>
            <p>🔵 Pressure: {weather.main.pressure} hPa</p>
            <p>🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
          </div>
        </div>
      )}

      <AIRecommendations weather={weather} />
      <Forecast city={submittedCity} apiKey={API_KEY} />
    </div>
  );
}

export default App;