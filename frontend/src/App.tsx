import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { ScorePage } from "./pages/ScorePage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/score"
        element={
          <ProtectedRoute>
            <ScorePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/score" replace />}
      />
    </Routes>
  );
}

export default App;