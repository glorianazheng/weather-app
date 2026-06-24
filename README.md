# 🌤️ WeatherAI - AI-Powered Smart Weather App

A modern, responsive Progressive Web App (PWA) that delivers real-time weather data with intelligent AI-powered recommendations.

---

## Features

- Real-time weather data — temperature, humidity, wind, pressure, feels like
- City search with error handling
- GPS current location detection
- Voice search
- AI recommendation system — clothing, activity, and safety suggestions
- Air Quality Index (AQI) display
- 5-day forecast with horizontal scroll
- Sunrise and sunset times
- Animated weather icons based on conditions
- Dynamic backgrounds that change with the weather
- Fully responsive — works on mobile, tablet, and desktop
- Installable as a PWA (Add to Home Screen)

---

## Tech Stack

- **Frontend:** React.js, CSS3
- **API:** OpenWeather API
- **PWA:** Service Worker, Web App Manifest
- **Deployment:** Vercel
- **Font:** Poppins (Google Fonts)

---

## Getting Started

1. Clone the repo
   git clone https://github.com/your-username/weather-app.git

2. Install dependencies
   npm install

3. Create a .env file in the root and add your OpenWeather API key
   REACT_APP_WEATHER_KEY=your_api_key_here

4. Run the app
   npm start

---

## Deployment

This app is deployed on Vercel. Every push to the main branch triggers an automatic redeployment.

---

## Project Structure

src/
  App.js                   - Main component and API logic
  App.css                  - Styling and animations
  components/
    Forecast.js            - 5-day forecast
    AIRecommendations.js   - AI suggestion engine
    SearchBar.js           - City search
    WeatherCard.js         - Current weather display

---
**Developer:** Gloriana Zheng
