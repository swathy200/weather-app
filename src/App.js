import React, { useState } from "react";
import axios from "axios";
import { 
  TextField, Button, Typography, Card, CardContent, 
  CircularProgress, Grid, Container, Box
} from "@mui/material";
import Lottie from "lottie-react";
import clearSky from "./animations/clearSky.json";
import cloudy from "./animations/cloudySky.json";
import rainy from "./animations/rainySky.json";
import snowy from "./animations/snowy.json";
import thunderstorm from "./animations/thunderstorm.json";

const API_KEY = "0347c418a1b2f304c35bbfda401fe64b";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
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
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      
      if (!geoResponse.data || geoResponse.data.length === 0) {
        setError("City not found");
        setLoading(false);
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
      const forecastData = forecastResponse.data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));
      setForecast(forecastData.slice(0, 5));
    } catch (err) {
      setError("City not found or API key issue");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherAnimation = () => {
    if (!weather) return clearSky;
    const condition = weather.weather[0].main.toLowerCase();
    switch (condition) {
      case "clear": return clearSky;
      case "clouds": return cloudy;
      case "rain": return rainy;
      case "snow": return snowy;
      case "thunderstorm": return thunderstorm;
      default: return clearSky;
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4, background: "#f5f5f5", borderRadius: 3, p: 4, boxShadow: 3 }}>
      <Typography variant="h3" fontWeight={600} gutterBottom>
        Weather Forecast
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField 
          label="Enter City" 
          variant="outlined" 
          fullWidth 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          sx={{ borderRadius: 2, bgcolor: "white" }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchWeather} 
          sx={{ fontWeight: "bold", borderRadius: 5, px: 4 }}
        >
          Get Weather
        </Button>
      </Box>
      {loading && <CircularProgress />}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {weather && (
        <Card sx={{ p: 4, boxShadow: 6, borderRadius: 4, textAlign: "center", width: "100%", maxWidth: "600px", mx: "auto" }}>
          <Lottie animationData={getWeatherAnimation()} loop style={{ height: 180 }} />
          <CardContent>
            <Typography variant="h4" fontWeight={500}>
              {weather.name}, {weather.sys.country}
            </Typography>
            <Typography variant="h5" color="primary">{weather.main.temp}°C</Typography>
            <Typography>{weather.weather[0].main} - {weather.weather[0].description}</Typography>
          </CardContent>
        </Card>
      )}
      <Grid container spacing={2} mt={3} justifyContent="center">
        {forecast.map((forecastData, index) => (
          <Grid item key={index} xs={12} sm={4} md={2.4}>
            <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, textAlign: "center", background: "#fff" }}>
              <Typography variant="h6">{new Date(forecastData.dt * 1000).toLocaleDateString()}</Typography>
              <Typography color="textSecondary">{forecastData.weather[0].main}</Typography>
              <Typography fontWeight={600}>{forecastData.main.temp}°C</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WeatherApp;
