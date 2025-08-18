"use client";

import { fetchDetails } from "@/app/services/api/tmdb";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function MovieDetailsClient({ id }: { id: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchDetails(id),
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p>Failed to load.</p>;

  const m = data as any;
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
        <p className="mt-2 text-gray-700">{m.overview}</p>
        {m.credits?.cast?.length ? (
          <div className="mt-4">
            <h2 className="font-semibold">Cast</h2>
            <ul className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-x-4">
              {m.credits.cast.slice(0, 12).map((c: any) => (
                <li key={c.cast_id}>
                  {c.name} <span className="text-gray-400">as</span>{" "}
                  {c.character}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
