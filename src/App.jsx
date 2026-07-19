import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (searchCity === "") return;

    const fetchWeather = async () => {
      setLoading(true);

      const API_KEY = import.meta.env.VITE_API_KEY;
      const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`;

      const response = await fetch(API_URL);

      const data = await response.json();

      if (data.cod !== 200) {
        setForecast([]);
        setError(data.message);
        setWeather(null);
        setLoading(false);
        return;
      }

      setError("");
      setWeather(data);

      const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`;

      const forecastResponse = await fetch(FORECAST_URL);

      const forecastData = await forecastResponse.json();

      setForecast(forecastData.list);

      console.log(data);

      setLoading(false);
    };

    fetchWeather();
  }, [searchCity]);

  return (
    <div className="app">
      <h1>Weather App⛅</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearchCity(city);
          }
        }}
      />
      <button
        onClick={() => {
          if (city.trim() !== "") {
            setSearchCity(city);
          }
        }}
      >
        Search City
      </button>
      {weather && weather.cod === 200 && (
        <div>
          <div className="weather-card">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <h2>{weather.name}</h2>
            <h1 className="weather-temp">{weather.main.temp}°C</h1>
            <p>
              <b>Humidity:</b> {weather.main.humidity}%
            </p>
            <p>
              <b>Wind:</b> {weather.wind.speed} m/s
            </p>
            <p>
              <b>Type:</b> {weather.weather[0].description}
            </p>
            <p>
              <b>Feels Like:</b> {weather.main.feels_like}°C
            </p>
            <p>
              <b>Pressure:</b> {weather.main.pressure} hPa
            </p>
            <p>
              <b>Condition:</b> {weather.weather[0].main}
            </p>
          </div>

          <h1 className="forecast-title">5 Day Forecast</h1>

          {forecast.length > 0 && (
            <div className="forecast-container">
              {forecast
                .filter((item) => item.dt_txt.includes("12:00:00"))
                .map((item) => (
                  <div className="forecast-card" key={item.dt}>
                    <p className="forecast-day">
                      {new Date(item.dt_txt).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>

                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="forecast icon"
                    />

                    <h3 className="forecast-temp">
                      {Math.round(item.main.temp)}°C
                    </h3>

                    <p className="forecast-condition">{item.weather[0].main}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
      {error && <p className="error">❌{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
