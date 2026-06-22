import React from 'react';

function Forecast({ city, apiKey }) {
  const [forecast, setForecast] = React.useState(null);

  React.useEffect(() => {
    if (!city) {
      setForecast(null);
      return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        setForecast(daily);
      });
  }, [city, apiKey]);

  if (!forecast) return null;

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" />
            <p>{Math.round(day.main.temp)}°C</p>
            <p>{day.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;