import { useLists } from "@/features/lists/store";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendationsByGenres } from "@/app/services/api/tmdb";
import { MovieCard } from "@/components/movie-card";

export function RecommendationsClient() {
  const favs = useLists((s) => s.list("favorites"));
  const watch = useLists((s) => s.list("watchlist"));
  const all = [...favs, ...watch];

  const genreCounts = all.flatMap((m) => m.genre_ids || []);
  const topGenres = [...new Set(genreCounts)].slice(0, 3);

  const { data, isPending } = useQuery({
    queryKey: ["recommendations", topGenres],
    queryFn: () => fetchRecommendationsByGenres(topGenres),
    enabled: topGenres.length > 0,
  });

  if (!topGenres.length) return <p>Add some movies to get recommendations!</p>;
  if (isPending) return <p>Loading personalized picks…</p>;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Recommended For You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data?.results?.slice(0, 8).map((m: any) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
