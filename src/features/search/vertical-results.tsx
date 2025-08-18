"use client";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { MovieCard } from "@/components/movie-card";
import type { MoviesPageData, MovieSummary } from "@/app/interfaces/movies";
import { fetchSearchMoviesPaged } from "@/app/services/api/tmdb";

export default function VerticalSearchResults({ query }: { query: string }) {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      MoviesPageData,
      Error,
      InfiniteData<MoviesPageData, number>,
      [string, string],
      number
    >({
      queryKey: ["search", query],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => fetchSearchMoviesPaged(query, pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      enabled: query.trim().length > 0,
      staleTime: 60_000,
    });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "600px 0px", threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 rounded bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  const items = (data?.pages ?? []).flatMap((p) => p.results) as MovieSummary[];
  if (!items.length) {
    return <p className="text-sm text-gray-600">No results for “{query}”.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      {hasNextPage ? <div ref={sentinelRef} /> : null}
    </>
  );
}
