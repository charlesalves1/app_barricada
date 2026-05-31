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

const center = {
  lat: -22.9068,
  lng: -43.1729,
};

function App() {
  const [points, setPoints] = useState([]);

  const loadPoints = async () => {
    const res = await fetch("http://127.0.0.1:8000/reports");
    const data = await res.json();
    setPoints(data);
  };

  useEffect(() => {
    loadPoints();
  }, []);

  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

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
  };

  return (
    <LoadScript
      googleMapsApiKey={
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={handleMapClick}
      >
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