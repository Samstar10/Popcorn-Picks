'use client';
import { create } from "zustand";

type UiState = {
  query: string;
  setQuery: (q: string) => void;
  selectedGenres: number[];
  toggleGenre: (id: number) => void;
  clearGenres: () => void;
  sortBy: string;            
  setSortBy: (s: string) => void;
};

export const useStore = create<UiState>((set, get) => ({
  query: "",
  setQuery: (q) => set({ query: q }),

  selectedGenres: [],
  toggleGenre: (id) => {
    const cur = get().selectedGenres;
    set({ selectedGenres: cur.includes(id) ? cur.filter(g => g !== id) : [...cur, id] });
  },
  clearGenres: () => set({ selectedGenres: [] }),

  sortBy: "popularity.desc",
  setSortBy: (s) => set({ sortBy: s }),
}));
