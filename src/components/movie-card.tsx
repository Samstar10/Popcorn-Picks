"use client";
import Link from "next/link";
import { FavoriteButton, WatchlistButton } from "./list-buttons";

export function MovieCard({
  movie,
}: {
  movie: { id: number; title: string; poster_path?: string; overview?: string; genre_ids?: number[] };
}) {
  const mini = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview,
    genre_ids: movie.genre_ids ?? [],
  };

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block rounded-lg bg-white hover:shadow-md transition-shadow"
      data-testid="movie-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-t-lg w-full h-72 object-cover"
        />
      ) : (
        <div className="rounded-t-lg h-72 bg-gray-200" />
      )}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2">{movie.title}</h3>
        {movie.overview ? (
          <p className="mt-1 text-xs text-gray-500 line-clamp-3">
            {movie.overview}
          </p>
        ) : null}
        <div>
          <FavoriteButton movie={mini} />
          <WatchlistButton movie={mini} />
        </div>
      </div>
    </Link>
  );
}
