import React, { useEffect, useState } from "react";
import { useBoothStore } from "../store/boothStore";
import type { ReservationFormData } from "../types";
import { ReservationModal } from "./ReservationModal";
import { InteractiveMap } from "./InteractiveMap";
import { getUserEmailFromToken } from "../services/auth";

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
  const [activeTab, setActiveTab] = useState<"map" | "reservations">("map");

  /* ----------------------------------
     INIT
  -----------------------------------*/
  useEffect(() => {
    const email = getUserEmailFromToken();
    setUser({ email });

    fetchBooths();
    fetchServices();
  }, [fetchBooths, fetchServices]);

  /* ----------------------------------
     RESERVATION SUBMIT
  -----------------------------------*/
  const handleReservationSubmit = async (data: ReservationFormData) => {
    if (!selectedBooth) return;

    try {
      const selectedServices = services.filter((s) =>
        data.services.includes(s.id)
      );

      const totalAmount =
        selectedBooth.price +
        selectedServices.reduce((sum, s) => sum + s.price, 0);

      const payload = {
        ...data,
        totalAmount,
        invoiceAddress: {
          companyName: data.invoiceAddress.companyName || "",
          street: data.invoiceAddress.street || "",
          postalCode: data.invoiceAddress.postalCode || "",
          city: data.invoiceAddress.city || "",
          country: data.invoiceAddress.country || "",
          nip: data.invoiceAddress.nip || "",
        },
      };
      await reserveBooth(selectedBooth.id, payload);

      setModalOpen(false);
      setSelectedBooth(null);
    } catch (err) {
      console.error("Reservation failed:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBooth(null);
  };

  const handleCancelReservation = () => {
    alert("Funkcja anulowania rezerwacji w backendzie w przygotowaniu.");
  };

  /* ----------------------------------
     GUARDS
  -----------------------------------*/
  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Błąd ładowania danych</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  /* ----------------------------------
     RENDER
  -----------------------------------*/
  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-xl font-bold text-[#830e21]">
            Panel Rezerwacji
          </h1>
          <span className="text-gray-700">Witaj, {user.email}</span>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 flex gap-8">
          <button
            onClick={() => setActiveTab("map")}
            className={`py-4 border-b-2 ${
              activeTab === "map"
                ? "border-[#830e21] text-[#830e21]"
                : "border-transparent text-gray-500"
            }`}
          >
            Mapa Stoisk
          </button>

          <button
            onClick={() => setActiveTab("reservations")}
            className={`py-4 border-b-2 ${
              activeTab === "reservations"
                ? "border-[#830e21] text-[#830e21]"
                : "border-transparent text-gray-500"
            }`}
          >
            Moje Rezerwacje ({reservations.length})
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {!isLoading && (
        <div className="container mx-auto px-4 py-8">
          {activeTab === "map" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Wybierz Stoisko
              </h2>
              <InteractiveMap />
            </div>
          )}

          {activeTab === "reservations" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold mb-6">
                Moje Rezerwacje
              </h2>

              {reservations.length === 0 ? (
                <p className="text-gray-400">
                  Brak rezerwacji
                </p>
              ) : (
                <div className="space-y-4">
                  {reservations.map((r) => {
                    const booth = booths.find(
                      (b) => b.id === r.boothId
                    );
                    return (
                      <div
                        key={r.id}
                        className="border rounded p-4 flex justify-between"
                      >
                        <div>
                          <h3 className="font-semibold">
                            Stoisko {booth?.number}
                          </h3>
                          <p>{r.companyName}</p>
                          <p>{r.contactEmail}</p>
                          <p className="font-bold text-[#830e21]">
                            {r.totalAmount} zł
                          </p>
                        </div>

                        <button
                          onClick={handleCancelReservation}
                          className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                          Anuluj
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
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
