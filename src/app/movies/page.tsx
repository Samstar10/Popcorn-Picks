"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

import AuthButtons from "@/components/auth-buttons";
import RecommendedRow from "@/features/recommendations/recommended-row";
import GenreRow from "@/features/rows/genre-row";
import VerticalSearchResults from "@/features/search/vertical-results";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/app/services/api/tmdb";

export default function MoviesPage() {
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });

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
    <section className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Popcorn Picks</h1>
        <div className="flex items-center gap-3">
          <AuthButtons />
          <Link href="/lists" className="text-sm underline">
            My Lists
          </Link>
        </div>
      </header>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search movies…"
          className="rounded-md border border-gray-300 px-3 py-2 w-full max-w-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="text-sm flex items-center gap-2">
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="release_date.desc">Newest</option>
            <option value="vote_average.desc">Top Rated</option>
          </select>
        </label>
      </div>

      {search.trim() ? (
        <VerticalSearchResults query={search.trim()} />
      ) : (
        <>
          {isAuthed ? (
            <RecommendedRow />
          ) : (
            <p className="text-sm text-gray-600">
              <button onClick={() => signIn("github")} className="underline">
                Sign in
              </button>{" "}
              to see personalized picks.
            </p>
          )}

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
  );
}
