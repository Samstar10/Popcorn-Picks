import { MovieDetails, MoviesPageData, RecData } from "@/app/interfaces/movies";
import axios from "axios";

const api = axios.create({ baseURL: "/api/tmdb" });

export async function fetchPopular(page = 1) {
  const { data } = await api.get<MoviesPageData>("/popular", {
    params: { page },
  });
  return data;
}

export async function searchMovies(q: string, page = 1) {
  const { data } = await api.get<MoviesPageData>("/search", {
    params: { query: q, page },
  });
  return data;
}

export async function fetchDetails(id: string) {
  const { data } = await api.get<MovieDetails>(`/movie/${id}`);
  return data;
}

export async function fetchSimilar(id: string) {
  const { data } = await api.get<MoviesPageData>(`/movie/${id}/similar`);
  return data;
}

export async function fetchRecommendationsByGenres(genreIds: number[]): Promise<RecData> {
  if (!genreIds.length) return { results: [] };
  const { data } = await api.get<MoviesPageData>("/discover", {
    params: { with_genres: genreIds.join(","), sort_by: "popularity.desc" },
  });
  return { results: data.results };
}

export async function fetchGenres() {
  const { data } = await api.get<{ genres: { id: number; name: string }[] }>(
    "/genre/movie/list"
  );
  return data.genres;
}

export async function discoverMovies(params: {
  page: number;
  with_genres?: string;
  sort_by?: string;
  query?: string;
}) {
  if (params.query) {
    const { data } = await api.get("/search", {
      params: { query: params.query, page: params.page },
    });
    return data;
  }
  const { data } = await api.get("/discover", {
    params: {
      with_genres: params.with_genres,
      sort_by: params.sort_by ?? "popularity.desc",
      page: params.page,
    },
  });
  return data;
}

export async function discoverByGenre(genreId: number, page = 1) {
  const { data } = await api.get<MoviesPageData>("/discover", {
    params: { with_genres: String(genreId), sort_by: "popularity.desc", page },
  });
  return data;
}

export async function fetchRecommendationsByGenresPaged(
  genreIds: number[],
  page = 1
) {
  if (!genreIds.length)
    return { results: [], page: 1, total_pages: 1 } as MoviesPageData;

  const { data } = await api.get<MoviesPageData>("/discover", {
    params: {
      with_genres: genreIds.join(","),
      sort_by: "popularity.desc",
      page,
    },
  });
  return data;
}

export async function fetchSearchMoviesPaged(query: string, page = 1) {
  const { data } = await api.get<MoviesPageData>("/search", {
    params: { query, page },
  });
  return data;
}

export async function fetchDiscoverMoviesPaged(opts: {
  genre: number;
  sortBy: string;
  page?: number;
}) {
  const { genre, sortBy, page = 1 } = opts;
  const { data } = await api.get<MoviesPageData>("/discover", {
    params: { with_genres: String(genre), sort_by: sortBy, page },
  });
  return data;
}
