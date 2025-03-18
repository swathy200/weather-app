import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import Lottie from "lottie-react";
import './App.css';

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

  // Function to get the correct Lottie animation based on weather
  const getWeatherAnimation = () => {
    if (!weather) return clearSky; // Default animation

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
    <div>
      <Lottie
        animationData={getWeatherAnimation()}
        loop
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          opacity: 0.7,
        }}
      />
      <Container
        maxWidth="sm"
        sx={{
          textAlign: "center",
          p: 3,
          borderRadius: 3,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        {/* Background Animation */}

        <Typography variant="h4" gutterBottom sx={{color:"lightblue"}}>
          WEATHER APP
        </Typography>

        <TextField
          label="Enter City Name"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ mb: 2, backgroundColor: "#fff", borderRadius: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={fetchWeather}
          fullWidth
        >
          Get Weather
        </Button>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {weather && (
          <Card
            sx={{
              mt: 3,
              p: 2,
              bgcolor: "rgba(48, 118, 197, 0.2)",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{color:"Blue"}}>
                {weather.name}, {weather.sys.country}
              </Typography>
              <Typography variant="h6" sx={{color:"Blue"}}>
                Temperature: {weather.main.temp}°C
              </Typography>
              <Typography variant="body1" sx={{color:"Blue"}}>
                {weather.weather[0].main} - {weather.weather[0].description}
              </Typography>
              <CardMedia
                component="img"
                image={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                sx={{ width: 80, mx: "auto", mt: 1 }}
              />
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default WeatherApp;
