"use client";

import HorizontalRow from "@/features/rows/horizontal-row";
import { fetchDiscoverMoviesPaged } from "@/app/services/api/tmdb";

export default function GenreRow({
  genreId,
  title,
  sortBy,
}: {
  genreId: number;
  title: string;
  sortBy: string;
}) {
  return (
    <HorizontalRow
      title={title}
      fetchPage={(page) =>
        fetchDiscoverMoviesPaged({ genre: genreId, sortBy, page })
      }
      queryKey={() => ["genre", genreId, sortBy]}
    />
  );
}
