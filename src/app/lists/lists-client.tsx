"use client";

import Link from "next/link";
import { useLists } from "@/features/lists/store";
import { MovieCard } from "@/components/movie-card";
import { useMemo } from "react";

export default function ListsClient() {
  const favMap = useLists((s) => s.favorites);
const watchMap = useLists((s) => s.watchlist);

const favs = useMemo(
  () => Object.values(favMap).sort((a, b) => b.addedAt - a.addedAt),
  [favMap]
);
const watch = useMemo(
  () => Object.values(watchMap).sort((a, b) => b.addedAt - a.addedAt),
  [watchMap]
);


  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Lists</h1>
        <Link href="/movies" className="text-sm underline">← Back to Movies</Link>
      </header>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Favorites</h2>
        {favs.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favs.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No favorites yet.</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Watchlist</h2>
        {watch.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {watch.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Your watchlist is empty.</p>
        )}
      </div>
    </section>
  );
}
