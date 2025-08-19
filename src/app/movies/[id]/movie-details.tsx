"use client";

import { fetchDetails, fetchSimilar } from "@/app/services/api/tmdb";
import { FavoriteButton, WatchlistButton } from "@/components/list-buttons";
import { MovieCard } from "@/components/movie-card";
import { Rating } from "@/components/rating";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import type {
  MovieDetails,
  MovieSummary,
  MoviesPageData,
} from "@/app/interfaces/movies";
import { Spinner } from "@/components/loading-state";

export default function MovieDetailsClient({ id }: { id: string }) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const detailsQuery = useQuery<MovieDetails>({
    queryKey: ["movie", id],
    queryFn: () => fetchDetails(id),
  });

  const similarQuery = useQuery<MoviesPageData>({
    queryKey: ["movie", id, "similar"],
    queryFn: () => fetchSimilar(id),
    enabled: isAuthed,
  });

  if (detailsQuery.isPending) return <Spinner />;
  if (detailsQuery.error) return <p>Failed to load.</p>;

  const m = detailsQuery.data;
  const bgPath = m.backdrop_path ?? m.poster_path ?? null;

  const genreIds =
    (Array.isArray(m.genres) ? m.genres.map((g) => g.id) : m.genre_ids) ?? [];

  return (
    <section className="relative min-h-screen">
      {bgPath && (
        <Image
          src={`https://image.tmdb.org/t/p/w1280${bgPath}`}
          alt={m.title}
          fill
          priority
          className="object-cover object-center"
          style={{ filter: "brightness(0.7)" }}
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-white dark:to-neutral-950" />

      <div className="absolute inset-x-0 top-0 z-20">
        <div className="max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="text-white text-2xl font-bold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
          >
            Popcorn Picks
          </Link>
        </div>
      </div>

      <article className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pt-28 md:pt-32 pb-8 md:pb-12">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            {m.poster_path && (
              <div className="hidden md:block">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                  width={200}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="text-white md:text-inherit">
              <h1 className="text-3xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {m.title}
              </h1>

              <div className="mt-3 flex gap-2">
                <FavoriteButton
                  movie={{
                    id: m.id,
                    title: m.title,
                    poster_path: m.poster_path,
                    overview: m.overview,
                    genre_ids: genreIds,
                  }}
                />
                <WatchlistButton
                  movie={{
                    id: m.id,
                    title: m.title,
                    poster_path: m.poster_path,
                    overview: m.overview,
                    genre_ids: genreIds,
                  }}
                />
              </div>

              <div className="mt-2">
                <Rating voteAverage={m.vote_average} />
              </div>

              <p className="mt-3 max-w-3xl text-white md:text-white">
                {m.overview}
              </p>

              {m.credits?.cast?.length ? (
                <div className="mt-6">
                  <h2 className="font-semibold md:text-inherit">Cast</h2>
                  <ul className="text-sm text-white md:text-white grid grid-cols-2 md:grid-cols-3 gap-x-4">
                    {m.credits.cast.slice(0, 12).map((c) => (
                      <li key={c.cast_id}>
                        {c.name}{" "}
                        <span className="text-white md:text-white">as</span>{" "}
                        {c.character}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <h2 className="text-xl font-semibold mb-3 text-white md:text-inherit">
              Recommended
            </h2>
            {isAuthed ? (
              similarQuery.data?.results?.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarQuery.data.results
                    .slice(0, 8)
                    .map((movie: MovieSummary) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-200 md:text-gray-600">
                  No recommendations yet.
                </p>
              )
            ) : (
              <button
                className="rounded border px-3 py-1 text-sm bg-white/10 text-white md:bg-transparent md:text-inherit"
                onClick={() => signIn("github")}
              >
                Sign in to see personalized picks
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
