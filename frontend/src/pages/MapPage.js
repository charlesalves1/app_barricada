import {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
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

 const [mapCenter, setMapCenter] =
  useState(defaultCenter);

const [mapInstance, setMapInstance] =
  useState(null);
const [autocomplete, setAutocomplete] =
  useState(null);

const [destination, setDestination] =
  useState("");
const [directions, setDirections] =
  useState(null);

const [routeInfo, setRouteInfo] =
  useState(null);
const [routeBarricades, setRouteBarricades] =
  useState(0);

  const [
    locationInitialized,
    setLocationInitialized,
  ] = useState(false);

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
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(
            newLocation
          );

          if (
            !locationInitialized
          ) {
            setMapCenter(
              newLocation
            );

            setLocationInitialized(
              true
            );
          }
        },

        (error) => {
          console.error(
            "Erro ao obter localização:",
            error
          );

          alert(
            `GPS ERRO ${error.code}: ${error.message}`
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
  }, [locationInitialized]);

  const loadPoints = async () => {
    try {
      const res = await fetch(
        "https://app-barricada.onrender.com/reports"
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
          JSON.parse(
            cachedReports
          )
        );

        setIsOffline(true);
      }
    }
  };

  useEffect(() => {
    loadPoints();

    const interval =
      setInterval(() => {
        loadPoints();
      }, 30000);

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

    setNearestDistance(
      nearest
    );
  }, [userLocation, points]);

  const handleMapClick = async (
    event
  ) => {
    const lat =
      event.latLng.lat();

    const lng =
      event.latLng.lng();

    try {
      await fetch(
        "https://app-barricada.onrender.com/report",
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
const centerOnUser = () => {
  if (
    mapInstance &&
    userLocation
  ) {
    mapInstance.panTo(
      userLocation
    );

    mapInstance.setZoom(15);
  }
};

const calculateRoute = () => {
  if (
    !autocomplete ||
    !userLocation
  ) {
    return;
  }

  const place =
    autocomplete.getPlace();

  if (
    !place ||
    !place.geometry
  ) {
    return;
  }

  const directionsService =
    new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin: userLocation,

      destination:
        place.geometry.location,

      travelMode:
        window.google.maps.TravelMode
          .DRIVING,
    },

    (result, status) => {
      if (
        status === "OK"
      ) {
        setDirections(
          result
        );

        const leg =
          result.routes[0]
            .legs[0];

        setRouteInfo({
          distance:
            leg.distance.text,
          duration:
            leg.duration.text,
        });
       const routePath =
  result.routes[0].overview_path;

let barricadesFound = 0;

points.forEach((point) => {
  const pointLatLng =
    new window.google.maps.LatLng(
      point.latitude,
      point.longitude
    );

  const isNearRoute =
    routePath.some((coord) => {
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          coord,
          pointLatLng
        );

      return distance <= 500;
    });

  if (isNearRoute) {
    barricadesFound++;
  }
});

setRouteBarricades(
  barricadesFound
);
      }
    }
  );
};
  if (!isOnline) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection:
            "column",
          justifyContent:
            "center",
          alignItems:
            "center",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>
          📡 Você está offline
        </h2>

        <p>
          O mapa do Google não
          está disponível sem
          internet.
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
            position:
              "absolute",
            top: 10,
            left: "50%",
            transform:
              "translateX(-50%)",
            zIndex: 9999,
            background:
              "#d32f2f",
            color: "#fff",
            padding:
              "8px 15px",
            borderRadius:
              "8px",
            fontWeight:
              "bold",
          }}
        >
          📡 Modo Offline
        </div>
      )}
<button
  onClick={centerOnUser}
  style={{
    position: "absolute",
    bottom: "100px",
    right: "20px",
    zIndex: 9999,
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "none",
    background: "#fff",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.3)",
    fontSize: "24px",
    cursor: "pointer",
  }}
>
  📍
</button>

<div
  style={{
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    zIndex: 10000,
  }}
>
 <Autocomplete
  onLoad={(auto) =>
    setAutocomplete(auto)
  }
  onPlaceChanged={
    calculateRoute
  }
>
    <input
      type="text"
      placeholder="Para onde você quer ir?"
      value={destination}
      onChange={(e) =>
        setDestination(
          e.target.value
        )
      }
      style={{
        width: "100%",
        height: "50px",
        padding: "0 15px",
        borderRadius: "25px",
        border: "none",
        outline: "none",
        fontSize: "16px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.25)",
      }}
    />
  </Autocomplete>
</div>
{
  routeInfo && (
    <div
      style={{
        position:
          "absolute",
        top: "70px",
        left: "50%",
        transform:
          "translateX(-50%)",
        zIndex: 10000,
        background:
          "#fff",
        padding:
          "12px 20px",
        borderRadius:
          "14px",
        boxShadow:
          "0 4px 15px rgba(0,0,0,0.2)",
        minWidth:
          "250px",
        textAlign:
          "center",
      }}
    >
      <div
        style={{
          fontWeight:
            "bold",
          fontSize:
            "18px",
        }}
      >
        🚗 {routeInfo.distance}
      </div>

      <div>
        ⏱️ {routeInfo.duration}
      </div>

      <div
        style={{
          marginTop:
            "6px",
          color:
            routeBarricades > 0
              ? "#d32f2f"
              : "#388e3c",
          fontWeight:
            "bold",
        }}
      >
        🚧 {routeBarricades}
        {" "}
        barricada(s)
        na rota
      </div>
    </div>
  )
}
      {nearestDistance !==
        null &&
        nearestDistance <=
          500 && (
          <div
            style={{
              position: "absolute",
                top: routeInfo
                      ? 190
                      : 80,
                left: "50%",
                transform:
                 "translateX(-50%)",
              zIndex: 9999,
              padding:
                "15px 25px",
              borderRadius:
                "10px",
              fontWeight:
                "bold",
              fontSize:
                "18px",
              color: "#fff",
              backgroundColor:
                nearestDistance <=
                300
                  ? "#d32f2f"
                  : "#f57c00",
            }}
          >
            {nearestDistance <=
            300
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
  center={mapCenter}
  zoom={15}
  onClick={handleMapClick}
  options={{
    gestureHandling: "greedy",
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  }}
  onLoad={(map) => {
    console.log(
      "MAPA CARREGADO"
    );

    setMapInstance(
      map
    );
  }}
>

        {userLocation && (
          <Marker
            position={
              userLocation
            }
            title="Você está aqui"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {barricadeMarkers}
        {directions && (
  <DirectionsRenderer
    directions={
      directions
    }
  />
)}
      </GoogleMap>
    </>
  );
}

export default MapPage;