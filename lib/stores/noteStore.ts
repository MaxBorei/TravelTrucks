import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  Transmission,
  Engine,
  Form,
  EquipmentKey,
  Camper,
} from "@/lib/types/types";

export type FiltersState = {
  location: string;
  filters: EquipmentKey[];
  transmission: Transmission | null;
  engine: Engine | null;
  vehicleType: Form | null;
};

const emptyFilters: FiltersState = {
  location: "",
  filters: [],
  transmission: null,
  engine: null,
  vehicleType: null,
};

type Store = {
  /** Дані */
  campers: Camper[];
  setCampers: (list: Camper[]) => void;

  /** Фільтри */
  filtersDraft: FiltersState;
  filtersApplied: FiltersState;

  setLocation: (value: string) => void;
  toggleEquipment: (key: EquipmentKey) => void;
  setTransmission: (key: Transmission | null) => void;
  setEngine: (key: Engine | null) => void;
  setVehicleType: (key: Form | null) => void;

  applyFilters: () => void;
  resetFilters: () => void;

  /** Обрані */
  favorites: Record<string, true>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  /** Селектор */
  getFilteredCampers: () => Camper[];
};

export const useNoteStore = create<Store>()(
  persist(
    (set, get) => ({
      /** Дані */
      campers: [],
      setCampers: (list) => set({ campers: list }),

      /** Фільтри */
      filtersDraft: { ...emptyFilters },
      filtersApplied: { ...emptyFilters },

      setLocation: (value) =>
        set((s) => ({ filtersDraft: { ...s.filtersDraft, location: value } })),

      toggleEquipment: (key) =>
        set((s) => {
          const has = s.filtersDraft.filters.includes(key);
          const next = has
            ? s.filtersDraft.filters.filter((k) => k !== key)
            : [...s.filtersDraft.filters, key];
          return { filtersDraft: { ...s.filtersDraft, filters: next } };
        }),

      setTransmission: (key) =>
        set((s) => ({
          filtersDraft: {
            ...s.filtersDraft,
            transmission: s.filtersDraft.transmission === key ? null : key,
          },
        })),

      setEngine: (key) =>
        set((s) => ({
          filtersDraft: {
            ...s.filtersDraft,
            engine: s.filtersDraft.engine === key ? null : key,
          },
        })),

      setVehicleType: (key) =>
        set((s) => ({
          filtersDraft: {
            ...s.filtersDraft,
            vehicleType: s.filtersDraft.vehicleType === key ? null : key,
          },
        })),

      applyFilters: () =>
        set((s) => ({ filtersApplied: { ...s.filtersDraft } })),
      resetFilters: () =>
        set(() => ({
          filtersDraft: { ...emptyFilters },
          filtersApplied: { ...emptyFilters },
        })),

      /** Обрані */
      favorites: {},
      addFavorite: (id) =>
        set((s) => ({ favorites: { ...s.favorites, [id]: true } })),
      removeFavorite: (id) =>
        set((s) => {
          const next = { ...s.favorites };
          delete next[id];
          return { favorites: next };
        }),
      toggleFavorite: (id) => {
        const { favorites, addFavorite, removeFavorite } = get();
        return favorites[id] ? removeFavorite(id) : addFavorite(id);
      },
      isFavorite: (id) => Boolean(get().favorites[id]),

      /** Селектор відфільтрованих кемперів */
      getFilteredCampers: () => {
        const { campers, filtersApplied: f } = get();

        const loc = f.location.trim().toLowerCase();
        const t = f.transmission ?? null;
        const e = f.engine ?? null;
        const vt = f.vehicleType ?? null;

        return campers.filter((c) => {
          const matchLocation = !loc || c.location.toLowerCase().includes(loc);
          const matchTransmission = t ? c.transmission === t : true;
          const matchEngine = e ? c.engine === e : true;
          const matchVehicleType = vt ? c.form === vt : true;

          const matchEquipment = f.filters.every(
            (key: EquipmentKey) =>
              (c as Record<EquipmentKey, boolean>)[key] === true
          );

          return (
            matchLocation &&
            matchTransmission &&
            matchEngine &&
            matchVehicleType &&
            matchEquipment
          );
        });
      },
    }),
    {
      name: "traveltrucks-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        favorites: s.favorites,
        filtersApplied: s.filtersApplied,
      }),
    }
  )
);
