import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { Box, TextField, Button } from "@mui/material";

const API_KEY = "0347c418a1b2f304c35bbfda401fe64b";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setError("");

    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (!geoResponse.data || geoResponse.data.length === 0) {
        setError("City not found");
        return;
      }

      const { lat, lon } = geoResponse.data[0];
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const filteredForecast = forecastResponse.data.list.filter(entry =>
        entry.dt_txt.includes("12:00:00")
      ).slice(0, 5);
      setForecast(filteredForecast);
    } catch (err) {
      setError("Something went wrong");
      setWeather(null);
      setForecast([]);
    }
  };

  return (
    <div className="weather-container">
      <Box className="search-box" sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          id="standard-basic"
          variant="standard"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ flex: 1, color: 'white' }}
        />
        <Button
          onClick={fetchWeather}
          variant="contained"
          sx={{ borderRadius: '20px', fontWeight: 'bold', px: 3 }}
        >
          Search
        </Button>
      </Box>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <div className="weather-top" style={{display:'flex',flexDirection:'row',width:"100%",justifyContent:"space-between",alignItems:"center"}}>
            <div className="weather-location">
              <h1>{weather.name}, {weather.sys.country}</h1>
              <p className="weather-date">{new Date().toDateString()}</p>
              <p className="weather-condition">{weather.weather[0].main}</p>
            </div>
            <div className="weather-temp">
              <h1 className="temperature" style={{fontSize:"74px"}}>{Math.round(weather.main.temp)}°C</h1>
            </div>
          </div>

          <div className="forecast">
            {forecast.map((f, index) => (
              <div key={index} className="forecast-box">
                <p className="forecast-day">{new Date(f.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}</p>
                <p className="forecast-temp">{Math.round(f.main.temp)}°C</p>
                <p className="forecast-condition">{f.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
