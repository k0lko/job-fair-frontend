import { create } from "zustand";
import type { Booth, Service, Reservation } from "../types";
import { api } from "../services/api";

interface BoothStore {
  booths: Booth[];
  services: Service[];
  reservations: Reservation[];
  selectedBooth: Booth | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  fetchBooths: () => Promise<void>;
  fetchServices: () => Promise<void>;
  setSelectedBooth: (booth: Booth | null) => void;
  setModalOpen: (open: boolean) => void;
  reserveBooth: (
    boothId: string,
    reservationData: Omit<Reservation, "id" | "createdAt" | "boothId">
  ) => Promise<void>;
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
      const res = await api.get("/booths");

      const transformed = res.data.map((booth: any) => ({
        id: booth.id.toString(),
        number: booth.boothNumber,
        x: booth.x,
        y: booth.y,
        width: booth.width,
        height: booth.height,
        price: booth.price,
        size: booth.size === "2x1" ? "2x1" : "1x1",
        status: booth.status.toLowerCase(),
        company: booth.company || undefined,
      }));

      set({ booths: transformed, isLoading: false });

    } catch (err: any) {
      console.error("Błąd pobierania booths:", err);
      set({ error: err?.message, isLoading: false });
    }
  },

  fetchServices: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.get("/services");

      const transformed = res.data.map((s: any) => ({
        id: s.serviceCode,
        name: s.name,
        description: s.description,
        price: s.price,
        vat: s.vat,
      }));

      set({ services: transformed, isLoading: false });

    } catch (err: any) {
      console.error("Błąd pobierania services:", err);
      set({ error: err?.message, isLoading: false });
    }
  },

  setSelectedBooth: (booth) => set({ selectedBooth: booth }),
  setModalOpen: (open) => set({ isModalOpen: open }),

  reserveBooth: async (boothId, reservationData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.post("/reservations", {
        boothId: parseInt(boothId),
        ...reservationData,
      });

      set((state) => ({
        reservations: [...state.reservations, res.data],
        booths: state.booths.map((b) =>
          b.id === boothId
            ? { ...b, status: "reserved", company: reservationData.companyName }
            : b
        ),
        isLoading: false,
      }));

    } catch (err: any) {
      console.error("Błąd rezerwacji:", err);
      set({ error: err?.message, isLoading: false });
      throw err;
    }
  },

  getBoothById: (id) => get().booths.find((b) => b.id === id),
  getReservationByBoothId: (boothId) =>
    get().reservations.find((r) => r.boothId === boothId),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
