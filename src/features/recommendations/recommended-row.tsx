"use client";

import { useMemo } from "react";
import { useLists } from "@/features/lists/store";
import HorizontalRow from "@/features/rows/horizontal-row";
import { fetchRecommendationsByGenresPaged } from "@/app/services/api/tmdb";

export default function RecommendedRow() {
  const favMap = useLists((s) => s.favorites);
  const watchMap = useLists((s) => s.watchlist);

  const all = useMemo(() => {
    const favs = Object.values(favMap);
    const watch = Object.values(watchMap);
    return [...favs, ...watch].sort((a, b) => b.addedAt - a.addedAt);
  }, [favMap, watchMap]);

  const genreCounts = all.flatMap((m) => m.genre_ids ?? []);
  const topGenres = Array.from(new Set(genreCounts)).slice(0, 3);
  const topGenresKey = topGenres.map(String);

  if (topGenres.length === 0) return null;

  return (
    <HorizontalRow
      title="Recommended For You"
      fetchPage={(page) => fetchRecommendationsByGenresPaged(topGenres, page)}
      queryKey={() => ["recs", topGenresKey]}
    />
  );
}
