import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: -22.9068,
  lng: -43.1729,
};

function App() {
  const [points, setPoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Obtém localização do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Carrega barricadas
  const loadPoints = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/reports");
      const data = await res.json();
      setPoints(data);
    } catch (error) {
      console.error("Erro ao carregar barricadas:", error);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  // Clique no mapa
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      await fetch("http://127.0.0.1:8000/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
        }),
      });

      loadPoints();
    } catch (error) {
      console.error("Erro ao criar barricada:", error);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={15}
        onClick={handleMapClick}
      >
        {/* Localização do usuário */}
        {userLocation && (
          <Marker
            position={userLocation}
            title="Você está aqui"
          />
        )}

        {/* Barricadas */}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={{
              lat: point.latitude,
              lng: point.longitude,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default App;