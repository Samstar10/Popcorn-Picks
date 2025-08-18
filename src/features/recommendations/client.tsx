"use client";

import { useLists } from "@/features/lists/store";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsByGenres } from "@/app/services/api/tmdb";
import { MovieCard } from "@/components/movie-card";
import { useMemo } from "react";

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

  const genreCounts = all.flatMap((m) => m.genre_ids || []);
  const topGenres = [...new Set(genreCounts)].slice(0, 3);

  const { data, isPending } = useQuery({
    queryKey: ["recommendations", topGenres],
    queryFn: () => fetchRecommendationsByGenres(topGenres),
    enabled: topGenres.length > 0,
  });

  if (!topGenres.length)
    return <p>Add movies to favorites/watchlist to see picks.</p>;
  if (isPending) return <p>Loading personalized picks…</p>;

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.results?.slice(0, 8).map((m: any) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
