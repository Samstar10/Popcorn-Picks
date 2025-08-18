'use client';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "../store";
import { SkeletonCard } from "@/components/skeleton-card";
import { MovieCard } from "@/components/movie-card";
import { fetchPopular, searchMovies } from "../services/api/tmdb";
import { MovieSummary, MoviesPageData } from "../interfaces/movies";

export default function MoviesPage() {
  const { query, setQuery } = useStore();
  const [page, setPage] = useState(1);

  const { data, isPending, fetchStatus, refetch } = useQuery<MoviesPageData>({
    queryKey: ["movies", query, page],
    queryFn: () => (query ? searchMovies(query, page) : fetchPopular(page)),
    // v5 replacement for keepPreviousData:
    placeholderData: (prev) => prev,
    // optional: small stale time so we don't refetch too aggressively
    staleTime: 60_000,
  });

  const isFetching = fetchStatus === "fetching";

  useEffect(() => {
    setPage(1);
    // refetch is optional because queryKey changed; keeping it explicit is fine:
    refetch();
  }, [query, refetch]);

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Popcorn Picks</h1>
        <input
          aria-label="Search movies"
          placeholder="Search movies"
          className="rounded-md border border-gray-300 px-3 py-2 w-full max-w-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      {isPending && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.results?.map((m: MovieSummary) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      <footer className="flex items-center gap-2">
        <button
          disabled={page <= 1 || isFetching}
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {page} {isFetching ? "(loading…)" : ""}
        </span>

        <button
          disabled={isFetching || (data ? page >= data.total_pages : false)}
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </footer>
    </section>
  );
}
