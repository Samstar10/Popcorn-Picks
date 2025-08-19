"use client";
import Image from "next/image";
import Link from "next/link";
export function MovieCardSm({
  movie,
}: {
  movie: { id: number; title: string; poster_path?: string };
}) {
  return (
    <Link href={`/movies/${movie.id}`} className="w-36 shrink-0">
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
          width={144}
          height={208}
          loading="lazy"
          className="h-52 w-36 rounded-lg object-cover"
        />
      ) : (
        <div className="h-52 w-36 rounded-lg bg-gray-200" />
      )}
      <p className="mt-2 text-xs line-clamp-2">{movie.title}</p>
    </Link>
  );
}
