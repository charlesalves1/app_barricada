import { MapContainer, TileLayer, Popup , Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
function MapClick({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

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

  const handleClick = async (latlng) => {
    await fetch("http://127.0.0.1:8000/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: latlng.lat,
        longitude: latlng.lng,
      }),
    });

    loadPoints();
  };

  return (
    <MapContainer center={[-22.9, -43.2]} zoom={13} style={{ height: "100vh" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClick onClick={handleClick} />

      {points.map((p) => (
  <Marker key={p.id} position={[p.latitude, p.longitude]}>
    <Popup>
      Barricada reportada <br />
      ID: {p.id}
    </Popup>
  </Marker>
))}
    </MapContainer>
  );
}

export default App;