import {
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: -22.9068,
  lng: -43.1729,
};

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371000;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function MapPage() {
  console.log("MapPage carregou");

  const [points, setPoints] =
    useState([]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [
    nearestDistance,
    setNearestDistance,
  ] = useState(null);

  const [isOffline, setIsOffline] =
    useState(false);

  const [isOnline, setIsOnline] =
    useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () =>
      setIsOnline(true);

    const handleOffline = () =>
      setIsOnline(false);

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  useEffect(() => {
    const watchId =
      navigator.geolocation.watchPosition(
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
          maximumAge: 10000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  const loadPoints = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/reports"
      );

      const data = await res.json();

      setPoints(data);

      localStorage.setItem(
        "cachedReports",
        JSON.stringify(data)
      );

      setIsOffline(false);
    } catch (error) {
      console.error(
        "Erro ao carregar barricadas:",
        error
      );

      const cachedReports =
        localStorage.getItem(
          "cachedReports"
        );

      if (cachedReports) {
        setPoints(
          JSON.parse(cachedReports)
        );

        setIsOffline(true);
      }
    }
  };

  useEffect(() => {
    loadPoints();

    const interval = setInterval(
      () => {
        loadPoints();
      },
      30000
    );

    return () =>
      clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      !userLocation ||
      points.length === 0
    ) {
      setNearestDistance(null);
      return;
    }

    let nearest = Infinity;

    points.forEach((point) => {
      const distance =
        calculateDistance(
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

  const handleMapClick = async (
    event
  ) => {
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

  const barricadeMarkers =
    useMemo(() => {
      return points.map(
        (point) => (
          <Marker
            key={point.id}
            position={{
              lat: point.latitude,
              lng: point.longitude,
            }}
            icon="/icons/barricada-amarela.png"
          />
        )
      );
    }, [points]);

  if (!isOnline) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>
          📡 Você está offline
        </h2>

        <p>
          O mapa do Google não está
          disponível sem internet.
        </p>

        <p>
          Barricadas salvas:
          {" "}
          <strong>
            {points.length}
          </strong>
        </p>
      </div>
    );
  }

  return (
    <>
      {isOffline && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform:
              "translateX(-50%)",
            zIndex: 9999,
            background: "#d32f2f",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          📡 Modo Offline
        </div>
      )}

      {nearestDistance !== null &&
        nearestDistance <= 500 && (
          <div
            style={{
              position: "absolute",
              top: 75,
              left: "50%",
              transform:
                "translateX(-50%)",
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
        mapContainerStyle={
          containerStyle
        }
        center={
          userLocation ||
          defaultCenter
        }
        zoom={15}
        onClick={handleMapClick}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Você está aqui"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {barricadeMarkers}
      </GoogleMap>
    </>
  );
}

export default MapPage;