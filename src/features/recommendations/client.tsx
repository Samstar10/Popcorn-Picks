"use client";

import { useMemo } from "react";
import { useLists } from "@/features/lists/store";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsByGenres } from "@/app/services/api/tmdb";
import { MovieCard } from "@/components/movie-card";
import type { MovieSummary, RecData } from "@/app/interfaces/movies";

export function RecommendationsClient() {
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
  const all = [...favs, ...watch];

  const genreCounts = all.flatMap((m) => m.genre_ids ?? []);
  const topGenres = Array.from(new Set(genreCounts)).slice(0, 3);
  const topGenresKey = topGenres.map(String);

  const { data, isPending } = useQuery<RecData>({
    queryKey: ["recommendations", topGenresKey],
    queryFn: () => fetchRecommendationsByGenres(topGenres) as Promise<RecData>,
    enabled: topGenres.length > 0,
    staleTime: 120_000,
    retry: 1,
  });

  if (!topGenres.length)
    return <p>Add movies to favorites/watchlist to see picks.</p>;
  if (isPending) return <p>Loading personalized picks…</p>;

  const results = data?.results ?? [];

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.slice(0, 8).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
