"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "@/app/services/api/tmdb";
import { useStore } from "@/app/store";

export default function FilterBar() {
  const { selectedGenres, toggleGenre, clearGenres, sortBy, setSortBy } =
    useStore();

  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        {genres?.map((g) => {
          const active = selectedGenres.includes(g.id);
          return (
            <button
              key={g.id}
              onClick={() => toggleGenre(g.id)}
              className={`rounded-full border px-3 py-1 text-sm ${
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
              }`}
              aria-pressed={active}
            >
              {g.name}
            </button>
          );
        })}
        {!!selectedGenres.length && (
          <button
            onClick={clearGenres}
            className="rounded-full border px-3 py-1 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      <label className="text-sm flex items-center gap-2">
        Sort by:
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
          <option value="release_date.desc">Newest</option>
        </select>
      </label>
    </div>
  );
}
