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
  const [airQuality, setAirQuality] = useState(null);
  const [listening, setListening] = useState(false);


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
      const aqRes = await axios.get(
  `https://api.openweathermap.org/data/2.5/air_pollution?lat=${res.data.coord.lat}&lon=${res.data.coord.lon}&appid=${API_KEY}`);
setAirQuality(aqRes.data.list[0].main.aqi);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice search is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenCity = event.results[0][0].transcript;
      setCity(spokenCity);
      setListening(false);
      fetchWeather();
    };

    recognition.onerror = () => {
      setError('Voice search failed. Please try again.');
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
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
          const aqRes = await axios.get(
  `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
setAirQuality(aqRes.data.list[0].main.aqi);
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
      <div className="app-header">
        <h1>⛅ WeatherAI</h1>
        <span className="date-pill">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn-search" onClick={fetchWeather}>Search</button>
        <button className="btn-location" onClick={fetchByLocation}>📍</button>
        <button className="btn-voice" onClick={startVoiceSearch}>
          {listening ? '🎤' : '🎙'}
        </button>
      </div>

      {loading && <p className="loading">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <p className="city-name">{weather.name}, {weather.sys.country}</p>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
          <p className="temp">{Math.round(weather.main.temp)}°</p>
          <p className="weather-desc">{weather.weather[0].description}</p>
          <div className="details">
            <div className="detail-item">
              <p className="detail-label">💧 Humidity</p>
              <p className="detail-value">{weather.main.humidity}%</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">🌬 Wind</p>
              <p className="detail-value">{weather.wind.speed} m/s</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">🔵 Pressure</p>
              <p className="detail-value">{weather.main.pressure} hPa</p>
            </div>
            <div className="detail-item">
              <p className="detail-label">🌅 Sunrise</p>
              <p className="detail-value">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>
      )}

      {airQuality && (
        <div className="aqi-card">
          <h3>🌫 Air Quality</h3>
          <p className="aqi-value">
            {airQuality === 1 && '😊 Good'}
            {airQuality === 2 && '🙂 Fair'}
            {airQuality === 3 && '😐 Moderate'}
            {airQuality === 4 && '😷 Poor'}
            {airQuality === 5 && '🤢 Very Poor'}
          </p>
          <p className="aqi-desc">
            {airQuality === 1 && 'Great air quality — enjoy the outdoors!'}
            {airQuality === 2 && 'Air quality is acceptable.'}
            {airQuality === 3 && 'Sensitive groups should limit outdoor exposure.'}
            {airQuality === 4 && 'Limit outdoor activities today.'}
            {airQuality === 5 && 'Avoid going outside if possible.'}
          </p>
        </div>
      )}

      <AIRecommendations weather={weather} />
      <Forecast city={submittedCity} apiKey={API_KEY} />
    </div>
  );

}

export default App;