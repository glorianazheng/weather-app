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
      setAirQuality(null);
      setSubmittedCity('');
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
        setWeather(null);
        setAirQuality(null);
        setSubmittedCity('');
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
       <button className="btn-location" onClick={fetchByLocation}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-7-5.686-7-11a7 7 0 1114 0c0 5.314-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
</button>
<button className="btn-voice" onClick={startVoiceSearch}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="11" rx="3" />
    <path d="M5 10a7 7 0 0014 0M12 19v3" />
  </svg>
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
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <path d="M12 2C8 8 5 11.5 5 15a7 7 0 0014 0c0-3.5-3-7-7-13z" />
    </svg>
    Humidity
  </p>
  <p className="detail-value">{weather.main.humidity}%</p>
</div>
<div className="detail-item">
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <path d="M3 8h11a3 3 0 100-6M3 16h15a3 3 0 110 6M3 12h8" />
    </svg>
    Wind
  </p>
  <p className="detail-value">{weather.wind.speed} m/s</p>
</div>
<div className="detail-item">
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l3 2" />
    </svg>
    Pressure
  </p>
  <p className="detail-value">{weather.main.pressure} hPa</p>
</div>
<div className="detail-item">
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <circle cx="12" cy="17" r="4" />
      <path d="M3 17h18M5 13l1.5-2M19 13l-1.5-2M9 9l1-2M15 9l-1-2" />
    </svg>
    Sunrise
  </p>
  <p className="detail-value">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
</div>
<div className="detail-item">
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <circle cx="12" cy="12" r="4" />
      <path d="M3 12h18M5 16l1.5 2M19 16l-1.5 2M9 19l1 2M15 19l-1 2" />
    </svg>
    Sunset
  </p>
  <p className="detail-value">{new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
</div>
<div className="detail-item">
  <p className="detail-label">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{verticalAlign: 'middle', marginRight: '4px'}}>
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
    </svg>
    Feels Like
  </p>
  <p className="detail-value">{Math.round(weather.main.feels_like)}°C</p>
</div>



          </div>
        </div>
      )}

      {airQuality && (
        <div className="aqi-card">
          <h3>AIR QUALITY</h3>
<p className="aqi-value">
  {airQuality === 1 && 'Good'}
  {airQuality === 2 && 'Fair'}
  {airQuality === 3 && 'Moderate'}
  {airQuality === 4 && 'Poor'}
  {airQuality === 5 && 'Very Poor'}
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