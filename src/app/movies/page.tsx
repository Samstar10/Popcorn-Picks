"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import AuthButtons from "@/components/auth-buttons";
import RecommendedRow from "@/features/recommendations/recommended-row";
import GenreRow from "@/features/rows/genre-row";
import VerticalSearchResults from "@/features/search/vertical-results";
import {
  fetchGenres,
  fetchTopRatedPaged,
  fetchTrendingPaged,
} from "@/app/services/api/tmdb";
import HorizontalRow from "@/features/rows/horizontal-row";
import type { MovieSummary } from "@/app/interfaces/movies";
import { KeenSliderPlugin } from "keen-slider";

function AutoPlay(delay = 4000): KeenSliderPlugin {
  return (slider) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const clearNextTimeout = () => timeout && clearTimeout(timeout);
    const nextTimeout = () => {
      clearNextTimeout();
      timeout = setTimeout(() => slider.next(), delay);
    };

    slider.on("created", () => {
      nextTimeout();
      slider.container.addEventListener("mouseover", clearNextTimeout);
      slider.container.addEventListener("mouseout", nextTimeout);
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
}

type HeroItem = MovieSummary & { backdrop_path?: string | null };

export default function MoviesPage() {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const hasQuery = Boolean(search.trim());

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["trending-hero"],
    queryFn: () => fetchTrendingPaged(1),
    staleTime: 60_000,
  });

  const trendingMovies: HeroItem[] = (trendingData?.results ?? []).slice(0, 10);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: "performance",
      drag: true,
      slides: { perView: 1 },
    },
    [AutoPlay(8000)]
  );

  const curated = (genres ?? []).filter((g) =>
    [
      "Action",
      "Comedy",
      "Drama",
      "Science Fiction",
      "Thriller",
      "Animation",
    ].includes(g.name)
  );

  return (
    <>
      <header
        className={
          hasQuery
            ? "relative z-20 flex w-full items-center justify-between px-10 py-6 text-white"
            : "absolute inset-x-0 top-0 z-20 flex w-full items-center justify-between p-6 text-white"
        }
      >
        <div className="flex items-center gap-2 lg:gap-6 w-1/2 max-w-5xl">
          <h1 className="text-base lg:text-2xl font-bold">Popcorn Picks</h1>
          <input
            type="text"
            placeholder="Search movies…"
            className={
              hasQuery
                ? "w-full max-w-xl rounded-md border border-gray-300 px-1 py-1 lg:px-4 lg:py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 text-xs lg:text-base"
                : "w-full max-w-xl rounded-md border border-white/50 bg-white/10 px-1 py-1 lg:px-4 lg:py-2 text-white placeholder-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 text-xs lg:text-base"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ml-6 flex items-center gap-1 lg:gap-4 w-1/2 max-w-2xl justify-end">
          <Link
            href="/lists"
            className={
              hasQuery
                ? "rounded border border-gray-400 px-1 py-1 lg:px-4 lg:py-2 font-bold text-xs lg:text-base hover:bg-black hover:text-white"
                : "rounded border border-white px-1 py-1 lg:px-4 lg:py-2 font-bold text-xs lg:text-base hover:bg-white hover:text-black"
            }
          >
            My Lists
          </Link>
          <AuthButtons />
        </div>
      </header>

      {!hasQuery && (
        <section className="relative h-[70vh] w-full overflow-hidden">
          {trendingMovies.length > 0 && (
            <div ref={sliderRef} className="keen-slider h-full">
              {trendingMovies.map((m: HeroItem) => (
                <div key={m.id} className="keen-slider__slide relative h-full">
                  <Link
                    href={`/movies/${m.id}`}
                    className="block h-full w-full"
                  >
                    {m.backdrop_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/original${m.backdrop_path}`}
                        alt={m.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white max-w-2xl px-4">
                      <h2 className="text-7xl font-bold drop-shadow-lg">
                        {m.title}
                      </h2>
                      {m.overview && (
                        <p className="mt-2 text-sm drop-shadow-md line-clamp-3">
                          {m.overview}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-6 p-10">
        {hasQuery ? (
          <VerticalSearchResults query={search.trim()} />
        ) : (
          <>
            {isAuthed && <RecommendedRow />}

            <HorizontalRow
              title="Trending Today"
              fetchPage={(page) => fetchTrendingPaged(page)}
              queryKey={() => ["trending"]}
            />

            <HorizontalRow
              title="Top Rated"
              fetchPage={(page) => fetchTopRatedPaged(page)}
              queryKey={() => ["top-rated"]}
            />

            {curated.map((g) => (
              <GenreRow
                key={g.id}
                genreId={g.id}
                title={g.name}
                sortBy={sortBy}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
