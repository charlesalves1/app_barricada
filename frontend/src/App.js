import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { LoadScript } from "@react-google-maps/api";

import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
  return (
    <LoadScript
      googleMapsApiKey={
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      }
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MapPage />
                <Navbar />
              </>
            }
          />

          <Route
            path="/admin"
            element={
              <>
                <Admin />
                <Navbar />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}

export default App;