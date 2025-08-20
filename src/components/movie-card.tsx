"use client";
import Link from "next/link";
import Image from "next/image";

export function MovieCard({
  movie,
}: {
  movie: {
    id: number;
    title: string;
    poster_path?: string | null;
    overview?: string | null;
    genre_ids?: number[];
  };
}) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      data-testid="movie-card"
      aria-label={movie.title}
      className="group h-full relative block overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={228}
          height={250}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
          loading="lazy"
          className="h-auto w-full rounded-lg object-cover transition duration-300 ease-in-out group-hover:blur-[2px] group-focus-visible:blur-[2px]"
        />
      ) : (
        <div className="h-full w-full rounded-lg bg-gray-200" />
      )}

      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-t from-black/70 via-black/40 to-transparent
          opacity-0 transition-opacity duration-300 ease-in-out
          group-hover:opacity-100 group-focus-visible:opacity-100
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0 p-3
          opacity-0 transition-opacity duration-300 ease-in-out
          group-hover:opacity-100 group-focus-visible:opacity-100
        "
      >
        <h3 className="text-5xl font-semibold text-white drop-shadow-sm line-clamp-2">
          {movie.title}
        </h3>
        {movie.overview ? (
          <p className="mt-1 text-xs text-gray-200 line-clamp-3">
            {movie.overview}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
