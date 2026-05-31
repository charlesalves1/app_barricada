import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MapPage from "./pages/MapPage";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<MapPage />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;