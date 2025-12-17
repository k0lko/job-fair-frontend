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
    boothId: string, // ⬅️ ID Z BAZY
    reservationData: Omit<Reservation, "id" | "createdAt" | "boothId">
  ) => Promise<void>;

  getBoothByNumber: (boothNumber: string) => Booth | undefined;
}

export const useBoothStore = create<BoothStore>((set, get) => ({
  booths: [],
  services: [],
  reservations: [],
  selectedBooth: null,
  isModalOpen: false,
  isLoading: false,
  error: null,

  async fetchBooths() {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/booths");

      const booths: Booth[] = res.data.map((b: any) => ({
        id: String(b.id),
        number: String(b.boothNumber),
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height,
        price: b.price,
        size: b.size === "2x1" ? "2x1" : "1x1",
        status: b.status.toLowerCase(),
        company: b.company ?? undefined,
      }));

      set({ booths, isLoading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Błąd stoisk", isLoading: false });
    }
  },

  async fetchServices() {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/services");
      const services: Service[] = res.data.map((s: any) => ({
        id: String(s.serviceCode),
        name: s.name,
        description: s.description,
        price: s.price,
        vat: s.vat,
      }));
      set({ services, isLoading: false });
    } catch (e: any) {
      set({ error: e.message ?? "Błąd usług", isLoading: false });
    }
  },

  getBoothByNumber(boothNumber) {
    return get().booths.find((b) => b.number === boothNumber);
  },

  setSelectedBooth: (booth) => set({ selectedBooth: booth }),
  setModalOpen: (open) => set({ isModalOpen: open }),

  reserveBooth: async (boothId, reservationData) => {
    set({ isLoading: true, error: null });

    try {
      const res = await api.post("/reservations", {
        boothId: Number(boothId),
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
      set({ error: err?.message ?? "Błąd rezerwacji", isLoading: false });
      throw err;
    }
  },
}));
