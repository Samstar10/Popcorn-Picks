"use client";

import { useLists } from "@/features/lists/store";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsByGenres } from "@/app/services/api/tmdb";
import { MovieCard } from "@/components/movie-card";
import type { RecData } from "@/app/interfaces/movies";

export function RecommendationsClient() {
  const favs = useLists((s) => s.list("favorites"));
  const watch = useLists((s) => s.list("watchlist"));
  const all = [...favs, ...watch];

  const genreCounts = all.flatMap((m) => m.genre_ids ?? []);
  const topGenres = Array.from(new Set(genreCounts)).slice(0, 3);

  const { data, isPending } = useQuery<RecData>({
    queryKey: ["recommendations", topGenres.map(String)],
    queryFn: () => fetchRecommendationsByGenres(topGenres) as Promise<RecData>,
    enabled: topGenres.length > 0,
    staleTime: 120_000,
    retry: 1,
  });

  if (!topGenres.length) return <p>Add some movies to get recommendations!</p>;
  if (isPending) return <p>Loading personalized picks…</p>;

  const results = data?.results ?? [];

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {results.slice(0, 8).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
