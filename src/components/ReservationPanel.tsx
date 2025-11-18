import React, { useState, useEffect } from 'react';
import { useBoothStore } from '../store/boothStore';
import type { ReservationFormData } from '../types';
import { ReservationModal } from './ReservationModal';
import { InteractiveMap } from './InteractiveMap';
import { getUserEmailFromToken, getToken, logout } from "../services/auth";

export const ReservationPanel: React.FC = () => {
  const {
    reservations,
    booths,
    services,
    selectedBooth,
    isModalOpen,
    setSelectedBooth,
    setModalOpen,
    reserveBooth,
    fetchBooths,
    fetchServices,
    isLoading,
    error,
  } = useBoothStore();

  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'reservations'>('map');

  // ProtectedRoute gwarantuje, że token istnieje
  // więc tutaj już tylko pobieramy email i dane z backendu
  useEffect(() => {
    const email = getUserEmailFromToken();
    setUser({ email });

    fetchBooths();
    fetchServices();
  }, [fetchBooths, fetchServices]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleBoothClick = (booth: any) => {
    setSelectedBooth(booth);
    setModalOpen(true);
  };

  const handleReservationSubmit = async (data: ReservationFormData) => {
    if (!selectedBooth) return;

    try {
      const selectedServices = services.filter((s) =>
        data.services.includes(s.id)
      );

      const totalAmount =
        selectedBooth.price +
        selectedServices.reduce((sum, s) => sum + s.price, 0);

      const safeData = {
        ...data,
        totalAmount,
        invoiceAddress: {
          companyName: data.invoiceAddress.companyName || '',
          street: data.invoiceAddress.street || '',
          postalCode: data.invoiceAddress.postalCode || '',
          city: data.invoiceAddress.city || '',
          country: data.invoiceAddress.country || '',
          nip: data.invoiceAddress.nip || '',
        },
      };

      await reserveBooth(selectedBooth.id, safeData);
      setModalOpen(false);
      setSelectedBooth(null);
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooth(null);
  };

  const handleCancelReservation = (reservationId: string, boothId: string) => {
    if (window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      alert('Funkcja anulowania rezerwacji w backendzie w przygotowaniu.');
    }
  };


  if (!user) {
    return null; // szybki fallback, bo ProtectedRoute i tak wymusza logowanie
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Błąd ładowania danych</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#830e21] text-white rounded hover:bg-red-800"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-[#830e21]">
            Panel Rezerwacji
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-lg text-gray-700">Witaj, {user.email}</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 flex space-x-8">
          <button
            onClick={() => setActiveTab('map')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'map'
                ? 'border-[#830e21] text-[#830e21]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mapa Stoisk
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === 'reservations'
                ? 'border-[#830e21] text-[#830e21]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Moje Rezerwacje ({reservations.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {!isLoading && (
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'map' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Wybierz Stoisko do Rezerwacji
              </h2>
              <InteractiveMap onBoothClick={handleBoothClick} />
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Moje Rezerwacje
              </h2>

              {reservations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">
                    Nie masz jeszcze żadnych rezerwacji
                  </p>
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-6 py-2 bg-[#830e21] text-white rounded-lg hover:bg-red-800 transition-colors"
                  >
                    Zarezerwuj Stoisko
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => {
                    const booth = booths.find((b) => b.id === reservation.boothId);

                    return (
                      <div
                        key={reservation.id}
                        className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Stoisko {booth?.number}
                            </h3>
                            <p className="text-gray-600">{reservation.companyName}</p>
                            <p className="text-gray-600">{reservation.contactEmail}</p>
                            <p className="text-gray-600">{reservation.contactPhone}</p>
                            <p className="mt-3 text-lg font-bold text-[#830e21]">
                              Łączna kwota: {reservation.totalAmount} zł
                            </p>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booth?.status === 'reserved'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {booth?.status === 'reserved'
                                ? 'Zarezerwowane'
                                : 'Potwierdzone'}
                            </span>
                            <button
                              onClick={() =>
                                handleCancelReservation(reservation.id, reservation.boothId)
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                            >
                              Anuluj
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reservation Modal */}
      {isModalOpen && selectedBooth && (
        <ReservationModal
          booth={selectedBooth}
          onClose={handleCloseModal}
          onSubmit={handleReservationSubmit}
        />
      )}
    </main>
  );
};
