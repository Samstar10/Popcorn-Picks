"use client";

import { fetchDetails, fetchSimilar } from "@/app/services/api/tmdb";
import { FavoriteButton, WatchlistButton } from "@/components/list-buttons";
import { MovieCard } from "@/components/movie-card";
import { Rating } from "@/components/rating";
import { useQuery } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

import type { MovieDetails, MovieSummary, MoviesPageData } from "@/app/interfaces/movies";

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

  if (detailsQuery.isPending) return <p>Loading…</p>;
  if (detailsQuery.error) return <p>Failed to load.</p>;

  const m = detailsQuery.data;

  const genreIds =
    (Array.isArray(m.genres) ? m.genres.map((g) => g.id) : m.genre_ids) ?? [];

  return (
    <article className="grid md:grid-cols-[200px_1fr] gap-6">
      {m.poster_path && (
        <Image
          src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
          alt={m.title}
          width={200}
          height={300}
          className="rounded-lg shadow"
        />
      )}
      <div>
        <h1 className="text-3xl font-bold">{m.title}</h1>

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

        <p className="mt-2 text-gray-700">{m.overview}</p>

        {m.credits?.cast?.length ? (
          <div className="mt-4">
            <h2 className="font-semibold">Cast</h2>
            <ul className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-x-4">
              {m.credits.cast.slice(0, 12).map((c) => (
                <li key={c.cast_id}>
                  {c.name} <span className="text-gray-400">as</span> {c.character}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="md:col-span-2 mt-8">
        <h2 className="text-xl font-semibold mb-3">Recommended</h2>
        {isAuthed ? (
          similarQuery.data?.results?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarQuery.data.results.slice(0, 8).map((movie: MovieSummary) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No recommendations yet.</p>
          )
        ) : (
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={() => signIn("github")}
          >
            Sign in to see personalized picks
          </button>
        )}
      </div>
    </article>
  );
}
