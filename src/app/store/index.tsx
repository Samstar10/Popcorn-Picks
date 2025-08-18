"use client";
import { create } from "zustand";

type Ui = {
  query: string;
  setQuery: (query: string) => void;
};

export const useStore = create<Ui>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
