import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
} from "@mui/material";
import Lottie from "lottie-react";
import "./App.css";

import clearSky from "./animations/clearSky.json";
import cloudy from "./animations/cloudySky.json";
import rainy from "./animations/rainySky.json";
import snowy from "./animations/snowy.json";
import thunderstorm from "./animations/thunderstorm.json";

const API_KEY = "0347c418a1b2f304c35bbfda401fe64b";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city,
            appid: API_KEY,
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (err) {
      setError("City not found or API key issue");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherAnimation = () => {
    if (!weather) return clearSky;

    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case "clear":
        return clearSky;
      case "clouds":
        return cloudy;
      case "rain":
        return rainy;
      case "snow":
        return snowy;
      case "thunderstorm":
        return thunderstorm;
      default:
        return clearSky;
    }
  };

  return (
    <div className="weather-app">
      <Lottie
        animationData={getWeatherAnimation()}
        loop
        className="background-animation"
      />
      <Container maxWidth="sm" className="glass-container">
        <Typography variant="h3" className="title">
          Weather App
        </Typography>
        <TextField
          label="Enter City"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <br/>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchWeather}
          className="search-btn"
          sx={{margin:'12px'}}
        >
          Get Weather
        </Button>
        {loading && <CircularProgress className="loader" />}
        {error && (
          <Typography color="error" className="error-text">
            {error}
          </Typography>
        )}
        {weather && (
          <Card className="weather-card" sx={{backgroundColor:'transparent'}}>
            <CardContent>
              <Typography variant="h4">
                {weather.name}, {weather.sys.country}
              </Typography>
              <Typography variant="h5">
                Temperature: {weather.main.temp}°C
              </Typography>
              <Typography>
                {weather.weather[0].main} - {weather.weather[0].description}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default WeatherApp;
