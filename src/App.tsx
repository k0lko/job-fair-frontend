import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { ReservationPanel } from "./components/ReservationPanel";
import { ContactPage } from "./pages/ContactPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";

import { isTokenExpired, getToken } from "./services/auth";
import type { JSX } from "react/jsx-runtime";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getToken();

  if (!token || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const [authState, setAuthState] = useState({
    token: getToken(),
    expired: isTokenExpired()
  });

  useEffect(() => {
    const refresh = () => {
      setAuthState({
        token: getToken(),
        expired: isTokenExpired()
      });
    };

    window.addEventListener("authChange", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("authChange", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const { token, expired } = authState;

  const isLogged = !!token && !expired;


  return (
    <Router>
      <Layout>
        <Routes>

          {/* PUBLIC */}          
          <Route
            path="/"
            element={
              isLogged ? <Navigate to="/reservations" replace /> : <HomePage />
            }
          />

          <Route
            path="/login"
            element={
              isLogged ? <Navigate to="/reservations" replace /> : <Login />
            }
          />

          <Route
            path="/register"
            element={
              isLogged ? <Navigate to="/reservations" replace /> : <Register />
            }
          />

          <Route path="/logout" element={<Logout />} />
          <Route path="/kontakt" element={<ContactPage />} />

          {/* PROTECTED */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute>
                <ReservationPanel />
              </ProtectedRoute>
            }
          />

          {/* 404 REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Layout>
    </Router>
  );
}
