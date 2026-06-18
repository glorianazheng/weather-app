import React from 'react';

function AIRecommendations({ weather }) {
  if (!weather) return null;

  const temp = weather.main.temp;
  const condition = weather.weather[0].main;
  const wind = weather.wind.speed;
  const humidity = weather.main.humidity;
  const suggestions = [];

 if (condition === 'Rain' || condition === 'Drizzle') {
  suggestions.push('Carry an umbrella today.');
}
if (temp > 35) {
  suggestions.push('High temperature — stay hydrated!');
}
if (temp < 0) {
  suggestions.push('Very cold — wear a heavy coat and gloves.');
}
if (temp >= 20 && temp <= 28 && condition === 'Clear') {
  suggestions.push('Perfect weather for outdoor activities!');
}
if (wind > 10) {
  suggestions.push('Strong winds today — hold onto your hat!');
}
if (humidity > 80) {
  suggestions.push('High humidity — dress light and stay cool.');
}
if (condition === 'Snow') {
  suggestions.push('Snowy conditions — drive carefully and wear boots.');
}
if (condition === 'Thunderstorm') {
  suggestions.push('Thunderstorm warning — stay indoors if possible.');
}
if (suggestions.length === 0) {
  suggestions.push('Weather looks good — enjoy your day!');
}


  return (
    <div className="recommendations">
      <h3>AI Recommendations</h3>
      {suggestions.map((s, i) => (
        <p key={i}>{s}</p>
      ))}
    </div>
  );
}

export default AIRecommendations;