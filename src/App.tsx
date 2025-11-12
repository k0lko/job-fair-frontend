import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { ReservationPanel } from "./components/ReservationPanel";
import { ReservationModal } from "./components/ReservationModal";
import { useBoothStore } from "./store/boothStore";
import type { ReservationFormData } from "./types";
import { ContactPage } from "./pages/ContactPage";

function App() {
  const {
    selectedBooth,
    setSelectedBooth,
    isModalOpen,
    setModalOpen,
    reserveBooth,
    services,
  } = useBoothStore();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleReservationSubmit = async (data: ReservationFormData) => {
    if (!selectedBooth) return;

    try {
      const totalAmount =
        selectedBooth.price +
        data.services.reduce((sum, id) => {
          const service = services.find((s) => s.id === id);
          return sum + (service?.price || 0);
        }, 0);

      await reserveBooth(selectedBooth.id, {
        ...data,
        totalAmount,
        invoiceAddress: {
          companyName: data.invoiceAddress.companyName ?? "",
          street: data.invoiceAddress.street ?? "",
          postalCode: data.invoiceAddress.postalCode ?? "",
          city: data.invoiceAddress.city ?? "",
          country: data.invoiceAddress.country ?? "",
          nip: data.invoiceAddress.nip ?? "",
        },
      });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#830e21] mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={user ? <ReservationPanel /> : <HomePage />}
          />
          <Route path="/kontakt" element={<ContactPage />} />
        </Routes>

        {isModalOpen && selectedBooth && (
          <ReservationModal
            booth={selectedBooth}
            onClose={handleCloseModal}
            onSubmit={handleReservationSubmit}
          />
        )}
      </Layout>
    </Router>
  );
}

export default App;
