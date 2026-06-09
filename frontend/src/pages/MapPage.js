import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: -22.9068,
  lng: -43.1729,
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );

  return R * c;
}

function MapPage() {
  const [points, setPoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestDistance, setNearestDistance] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // GPS em tempo real
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(
          "Erro ao obter localização:",
          error
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const loadPoints = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/reports"
      );

      const data = await res.json();

      setPoints(data);
    } catch (error) {
      console.error(
        "Erro ao carregar barricadas:",
        error
      );
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  // Descobrir barricada mais próxima
  useEffect(() => {
    if (!userLocation || points.length === 0) {
      setNearestDistance(null);
      return;
    }

    let nearest = Infinity;

    points.forEach((point) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        point.latitude,
        point.longitude
      );

      if (distance < nearest) {
        nearest = distance;
      }
    });

    setNearestDistance(nearest);
  }, [userLocation, points]);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    try {
      await fetch(
        "http://127.0.0.1:8000/report",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
          }),
        }
      );

      loadPoints();
    } catch (error) {
      console.error(
        "Erro ao criar barricada:",
        error
      );
    }
  };

  if (!isLoaded) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <>
      {/* ALERTA TIPO RADARBOT */}
      {nearestDistance !== null &&
        nearestDistance <= 500 && (
          <div
            style={{
              position: "absolute",
              top: 75,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              padding: "15px 25px",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "18px",
              color: "#fff",
              backgroundColor:
                nearestDistance <= 300
                  ? "#d32f2f"
                  : "#f57c00",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {nearestDistance <= 300
              ? `🚨 ATENÇÃO! Barricada a ${Math.round(
                  nearestDistance
                )}m`
              : `⚠️ Barricada próxima - ${Math.round(
                  nearestDistance
                )}m`}
          </div>
        )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          userLocation || defaultCenter
        }
        zoom={15}
        onClick={handleMapClick}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Você está aqui"
          />
        )}

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
    </>
  );
}

export default MapPage;