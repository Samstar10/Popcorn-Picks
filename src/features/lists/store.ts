"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ListKind, SavedMovie, UserListsState } from "../../app/interfaces/movies";

type Actions = {
  add: (kind: ListKind, movie: Omit<SavedMovie, "addedAt">) => void;
  remove: (kind: ListKind, id: number) => void;
  toggle: (kind: ListKind, movie: Omit<SavedMovie, "addedAt">) => void;
  isIn: (kind: ListKind, id: number) => boolean;
  list: (kind: ListKind) => SavedMovie[];
};

export const useLists = create<UserListsState & Actions>()(
  persist(
    (set, get) => ({
      favorites: {},
      watchlist: {},

      add: (kind, movie) =>
        set((s) => ({
          [kind]: {
            ...s[kind],
            [movie.id]: { ...movie, addedAt: Date.now() },
          },
        }) as Partial<UserListsState>),

      remove: (kind, id) =>
        set((s) => {
          const copy = { ...s[kind] };
          delete copy[id];
          return { [kind]: copy } as Partial<UserListsState>;
        }),

      toggle: (kind, movie) => {
        const exists = get().isIn(kind, movie.id);
        return exists ? get().remove(kind, movie.id) : get().add(kind, movie);
      },

      isIn: (kind, id) => Boolean(get()[kind][id]),

      list: (kind) =>
        Object.values(get()[kind]).sort((a, b) => b.addedAt - a.addedAt),
    }),
    {
      name: "ppicks.userlists.v1", // localStorage key
      partialize: (s) => ({ favorites: s.favorites, watchlist: s.watchlist }),
    }
  )
);
