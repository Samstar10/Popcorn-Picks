"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import { useStore } from "../store";
import {
  discoverMovies,
  fetchPopular,
  searchMovies,
} from "../services/api/tmdb";
import { MovieSummary, MoviesPageData } from "../interfaces/movies";

import { SkeletonCard } from "@/components/skeleton-card";
import { MovieCard } from "@/components/movie-card";
import AuthButtons from "@/components/auth-buttons";
import FilterBar from "@/features/filters/filter-bar";
import { RecommendationsClient } from "@/features/recommendations/client";

export default function MoviesPage() {
  const { query, setQuery, selectedGenres, sortBy } = useStore();
  const [page, setPage] = useState(1);
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const filtersActive = useMemo(
    () => !!query || selectedGenres.length > 0 || !!sortBy,
    [query, selectedGenres, sortBy]
  );

  const { data, isPending, fetchStatus, refetch } = useQuery<MoviesPageData>({
    queryKey: ["movies", { query, selectedGenres, sortBy, page }],
    queryFn: () => {
      if (query) return searchMovies(query, page);
      if (selectedGenres.length > 0 || sortBy !== "popularity.desc") {
        return discoverMovies({
          page,
          with_genres: selectedGenres.join(","),
          sort_by: sortBy,
        });
      }
      return fetchPopular(page);
    },
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });

  const isFetching = fetchStatus === "fetching";

  useEffect(() => {
    setPage(1);
    refetch();
  }, [query, selectedGenres, sortBy, refetch]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Popcorn Picks</h1>
        <div className="flex items-center gap-3">
          <input
            aria-label="Search movies"
            placeholder="Search movies"
            className="rounded-md border border-gray-300 px-3 py-2 w-full max-w-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <AuthButtons />
          <Link href="/lists" className="text-sm underline">
            My Lists
          </Link>
        </div>
      </header>

      <FilterBar />

      {isPending && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data?.results?.map((m: MovieSummary) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {!filtersActive && (
        <>
          {isAuthed ? (
            <RecommendationsClient />
          ) : (
            <p className="text-sm text-gray-600">
              <button onClick={() => signIn("github")} className="underline">
                Sign in
              </button>{" "}
              to see personalized picks just for you.
            </p>
          )}
        </>
      )}

      <footer className="flex items-center gap-2">
        <button
          disabled={page <= 1 || isFetching}
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">
          Page {page} {isFetching ? "(loading…)" : ""}
        </span>
        <button
          disabled={isFetching || (data ? page >= data.total_pages : false)}
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </footer>
    </section>
  );
}
