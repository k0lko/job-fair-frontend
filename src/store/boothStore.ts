import { create } from 'zustand';
import type { Booth, Service, Reservation } from '../types';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api';

interface BoothStore {
  booths: Booth[];
  services: Service[];
  reservations: Reservation[];
  selectedBooth: Booth | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBooths: () => Promise<void>;
  fetchServices: () => Promise<void>;
  setSelectedBooth: (booth: Booth | null) => void;
  setModalOpen: (open: boolean) => void;
  reserveBooth: (boothId: string, reservationData: Omit<Reservation, 'id' | 'createdAt' | 'boothId'>) => Promise<void>;
  getBoothById: (id: string) => Booth | undefined;
  getReservationByBoothId: (boothId: string) => Reservation | undefined;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBoothStore = create<BoothStore>((set, get) => ({
  booths: [],
  services: [],
  reservations: [],
  selectedBooth: null,
  isModalOpen: false,
  isLoading: false,
  error: null,

  fetchBooths: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/booths`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Transform backend data to frontend format
      const transformedBooths: Booth[] = data.map((booth: any) => ({
        id: booth.id.toString(),
        number: booth.boothNumber,
        x: booth.x,
        y: booth.y,
        width: booth.width,
        height: booth.height,
        price: booth.price,
        size: booth.size === '2x1' ? '2x1' : '1x1',
        status: booth.status.toLowerCase() as Booth['status'],
        company: booth.company || undefined,
      }));
      
      set({ booths: transformedBooths, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch booths', isLoading: false });
    }
  },

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Usługi pobrane z backendu:", data);

      // Obsługa obu przypadków — z `id` lub z `serviceCode`
      const transformedServices: Service[] = data.map((service: any) => ({
      id: service.serviceCode, // <-- klucz z backendu
      name: service.name,
      description: service.description,
      price: service.price,
      vat: service.vat,
    }));


      set({ services: transformedServices, isLoading: false });
    } catch (error) {
      console.error('Błąd podczas pobierania usług:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch services',
        isLoading: false,
      });
    }
  },

  setSelectedBooth: (booth) => set({ selectedBooth: booth }),

  setModalOpen: (open) => set({ isModalOpen: open }),

  reserveBooth: async (boothId, reservationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boothId: parseInt(boothId),
          companyName: reservationData.companyName,
          industry: reservationData.industry,
          website: reservationData.website,
          contactName: reservationData.contactName,
          contactEmail: reservationData.contactEmail,
          contactPhone: reservationData.contactPhone,
          invoiceAddress: reservationData.invoiceAddress,
          services: reservationData.services,
          agreedToTerms: reservationData.agreedToTerms,
          agreedToParticipation: reservationData.agreedToParticipation,
          agreedToConditions: reservationData.agreedToConditions,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create reservation');
      }

      const newReservation = await response.json();
      
      set((state) => ({
        reservations: [...state.reservations, newReservation],
        booths: state.booths.map(booth =>
          booth.id === boothId
            ? { ...booth, status: 'reserved', company: reservationData.companyName }
            : booth
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create reservation', isLoading: false });
      throw error;
    }
  },

  getBoothById: (id) => get().booths.find(booth => booth.id === id),

  getReservationByBoothId: (boothId) => get().reservations.find(reservation => reservation.boothId === boothId),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));