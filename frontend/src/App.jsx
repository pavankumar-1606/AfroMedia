import { Routes, Route, Navigate } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignupPage.jsx";
import HomeLayout from "./pages/HomeLayout.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/auth" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<LoginSignupPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
