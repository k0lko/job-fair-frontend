import React, { useEffect } from 'react';
import { useBoothStore } from '../store/boothStore';
import FrontPagePhoto from '../assets/FrontPagePhoto.jpeg';

export const HomePage: React.FC = () => {
  const { fetchBooths, fetchServices, isLoading, error } = useBoothStore();

  useEffect(() => {
    fetchBooths();
    fetchServices();
  }, [fetchBooths, fetchServices]);

  const handleLogin = () => {
    const user = {
      id: '1',
      email: 'firma@przyklad.pl',
      name: 'Przykładowa Firma',
      isLoggedIn: true,
    };
    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-lg mb-4">Błąd ładowania danych</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#830e21] text-white rounded hover:bg-red-800 transition"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#830e21] mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 font-saira">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#830e21] mb-3 sm:mb-4 leading-tight">
            Targi Pracy i Kariery
          </h1>
          <h2 className="text-2xl sm:text-3xl text-gray-800 mb-4 sm:mb-6">
            Your Future 2025
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-xl mx-auto md:mx-0">
            Politechnika Bydgoska zaprasza firmy do udziału w największych targach pracy w regionie. 
            Zarezerwuj swoje stoisko już dziś i połącz się z najlepszymi kandydatami!
          </p>
          <button
            onClick={handleLogin}
            className="bg-[#830e21] text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-red-800 transition shadow-md text-sm sm:text-base"
          >
            Zaloguj się i zarezerwuj stoisko
          </button>
        </div>

        <div className="flex-1 w-full">
          <img
            src={FrontPagePhoto}
            alt="Targi Pracy Politechniki Bydgoskiej"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>
      </section>

      {/* Info Cards */}
      <section className="container mx-auto px-4 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[
          { title: "Stoiska Typ A", size: "1x1 metr", price: "1300 zł + 23% VAT" },
          { title: "Stoiska Typ B", size: "2x1 metry", price: "1600 zł + 23% VAT" },
          { title: "Pakiety Sponsorskie", size: "Pełny pakiet sponsorski", price: "5000 zł + 23% VAT" },
        ].map(({ title, size, price }) => (
          <div
            key={title}
            className="bg-white rounded-lg shadow-md sm:shadow-lg p-6 border-t-4 border-[#830e21] text-center sm:text-left"
          >
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h4>
            <p className="text-gray-700 mb-1 sm:mb-2">{size}</p>
            <p className="text-xl sm:text-2xl font-bold text-[#830e21]">{price}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#830e21] text-white py-10 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          <div>
            <h5 className="text-lg font-bold mb-3">Kontakt</h5>
            <p>Al. Prof. S. Kaliskiego 7</p>
            <p>85-796 Bydgoszcz</p>
            <p>tel: +48 52 374 92 74</p>
            <p>kom: +48 512 006 671</p>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-3">Informacje</h5>
            <p>e-mail: targipracy@pbs.edu.pl</p>
            <p>www.pbs.edu.pl</p>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-3">Godziny targów</h5>
            <p>data wydarzenia</p>
            <p>9:00 - 14:00</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs sm:text-sm text-gray-200">
          © {new Date().getFullYear()} Politechnika Bydgoska. Wszystkie prawa zastrzeżone.
        </div>
      </footer>
    </main>
  );
};
