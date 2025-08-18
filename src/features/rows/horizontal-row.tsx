"use client";
import { useEffect, useRef } from "react";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { MovieCardSm } from "@/components/movie-card-sm";
import type { MoviesPageData } from "@/app/interfaces/movies";

type Props = {
  title: string;
  enabled?: boolean;
  fetchPage: (page: number) => Promise<MoviesPageData>;
  queryKey: (page?: number) => (string | number | string[])[];
};

export default function HorizontalRow({
  title,
  enabled = true,
  fetchPage,
  queryKey,
}: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    MoviesPageData,                       // page shape
    Error,
    InfiniteData<MoviesPageData, number>, // enables data.pages
    (string | number | string[])[],
    number
  >({
    queryKey: queryKey(),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchPage(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled,
    staleTime: 60_000,
  });

  // The actual scrolling container and the sentinel at the end of the row
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Observe the sentinel INSIDE the scroll container
  useEffect(() => {
    if (!hasNextPage || !scrollerRef.current || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollerRef.current, // <-- key: observe within the horizontal scroller
        rootMargin: "0px 600px 0px 0px", // prefetch a bit before the end on the right
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = (data?.pages ?? []).flatMap((p) => p.results);

  if (status === "pending") {
    return (
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div ref={scrollerRef} className="overflow-x-auto">
          <div className="flex gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-52 w-36 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div ref={scrollerRef} className="overflow-x-auto">
        <div className="flex gap-3 pr-8">
          {items.map((m) => (
            <MovieCardSm key={m.id} movie={m} />
          ))}
          {/* sentinel sits at the very end of the horizontal row */}
          {hasNextPage ? <div ref={sentinelRef} className="w-1 shrink-0" /> : null}
        </div>
      </div>
    </section>
  );
}
