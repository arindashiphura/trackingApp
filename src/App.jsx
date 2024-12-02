import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { IoLocationSharp } from 'react-icons/io5';
import 'leaflet/dist/leaflet.css';

// Your API key for OpenWeatherMap
const API_KEY = "d46779f81f2711423cc87e3faf9277a4"; 

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState("");

  // Get the user's current location using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position fetched: ", position); // Log position for debugging
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error: ", err);
          setError("Failed to get your location.");
        }
      );
    }
  }, []);

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError("");
    } catch (err) {
      setError("City not found. Please try again.");
      setWeather(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "300px" }}
      />
      <button onClick={fetchWeather} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}

      {/* Map Section */}
      <div style={{ height: "500px", width:"1000px", marginTop: "50px" }}>
        {location.lat && location.lon ? (
          <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.lat, location.lon]}>
              <Popup>
                Your Location <IoLocationSharp />
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading location...</p>
        )}
      </div>
    </div>
  );
}

export default App;
