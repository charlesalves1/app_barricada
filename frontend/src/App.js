import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
  return (
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
  );
}

export default App;