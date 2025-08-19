"use client";
import Link from "next/link";
import { FavoriteButton, WatchlistButton } from "./list-buttons";
import Image from "next/image";

export function MovieCard({
  movie,
}: {
  movie: {
    id: number;
    title: string;
    poster_path?: string;
    overview?: string;
    genre_ids?: number[];
  };
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
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={228}
          height={342}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
          loading="lazy"
          className="rounded-lg w-full h-auto object-cover"
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
