import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { getToken, isTokenExpired, logout, getUserEmailFromToken } from "../services/auth";

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateAuthState = () => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      setEmail(getUserEmailFromToken());
    } else {
      setEmail(null);
    }
  };

useEffect(() => {
  const refresh = () => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      setEmail(getUserEmailFromToken());
    } else {
      setEmail(null);
    }
  };

  refresh();

  window.addEventListener("authChange", refresh);
  window.addEventListener("storage", refresh);

  return () => {
    window.removeEventListener("authChange", refresh);
    window.removeEventListener("storage", refresh);
  };
}, []);

  const handleLogout = () => {
    logout();
    updateAuthState();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-[#830e21] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
          <span className="text-lg sm:text-2xl font-bold tracking-wide">
            Politechnika Bydgoska
          </span>
          <span className="hidden md:block text-sm opacity-90">
            Your Future 2025
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          <Link
            to="/kontakt"
            className="bg-white text-[#830e21] px-4 py-1.5 rounded-md hover:bg-gray-100 transition font-semibold"
          >
            Kontakt
          </Link>

          {!email ? (
            <>
              <Link
                to="/login"
                className="border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-[#830e21] transition font-semibold"
              >
                Zaloguj
              </Link>

              <Link
                to="/register"
                className="bg-white text-[#830e21] px-4 py-1.5 rounded-md hover:bg-gray-100 transition font-semibold"
              >
                Rejestracja
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-[#830e21] transition font-semibold"
            >
              Wyloguj ({email})
            </button>
          )}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};
