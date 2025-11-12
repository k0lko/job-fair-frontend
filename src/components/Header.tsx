// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const handleLogin = () => {
    const demoUser = {
      id: "1",
      email: "firma@przyklad.pl",
      name: "Przykładowa Firma",
      isLoggedIn: true,
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    window.location.reload();
  };

  const handleRegister = () => {
    alert("Tu pojawi się formularz rejestracji (w przygotowaniu)");
  };

  return (
    <header className="bg-[#830e21] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* 🔗 Logo / powrót do strony głównej */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
          <span className="text-lg sm:text-2xl font-bold tracking-wide">
            Politechnika Bydgoska
          </span>
          <span className="hidden md:block text-sm opacity-90">
            Your Future 2025
          </span>
        </Link>

        {/* Nawigacja desktop */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
          <Link
            to="/kontakt"
            className="bg-white text-[#830e21] px-4 py-1.5 rounded-md hover:bg-gray-100 transition font-semibold"
          >
            Kontakt
          </Link>

          {!user ? (
            <>
              <button
                onClick={handleLogin}
                className="border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-[#830e21] transition font-semibold"
              >
                Zaloguj
              </button>
              <button
                onClick={handleRegister}
                className="bg-white text-[#830e21] px-4 py-1.5 rounded-md hover:bg-gray-100 transition font-semibold"
              >
                Rejestracja
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="border border-white px-4 py-1.5 rounded-md hover:bg-white hover:text-[#830e21] transition font-semibold"
            >
              Wyloguj
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#a21a2a] px-4 pb-4 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block w-full bg-white text-[#830e21] px-4 py-2 rounded-md font-semibold text-center hover:bg-gray-100 transition"
          >
            Strona główna
          </Link>
          <Link
            to="/kontakt"
            onClick={() => setMenuOpen(false)}
            className="block w-full bg-white text-[#830e21] px-4 py-2 rounded-md font-semibold text-center hover:bg-gray-100 transition"
          >
            Kontakt
          </Link>

          {!user ? (
            <>
              <button
                onClick={() => {
                  handleLogin();
                  setMenuOpen(false);
                }}
                className="block w-full border border-white px-4 py-2 rounded-md font-semibold text-white text-center hover:bg-white hover:text-[#830e21] transition"
              >
                Zaloguj
              </button>
              <button
                onClick={() => {
                  handleRegister();
                  setMenuOpen(false);
                }}
                className="block w-full bg-white text-[#830e21] px-4 py-2 rounded-md font-semibold text-center hover:bg-gray-100 transition"
              >
                Rejestracja
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full bg-white text-[#830e21] px-4 py-2 rounded-md font-semibold text-center hover:bg-gray-100 transition"
            >
              Wyloguj
            </button>
          )}
        </div>
      )}
    </header>
  );
};
