import { MoviesPageData } from "@/app/interfaces/movies";
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
  const { data } = await api.get(`/movie/${id}`);
  return data;
}

export async function fetchSimilar(id: string) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data } = await api.get<{ results: any[] }>(`/movie/${id}/similar`);
  return data;
}

export async function fetchRecommendationsByGenres(genreIds: number[]) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  if (!genreIds.length) return { results: [] as any[] };
  const { data } = await api.get("/discover", {
    params: { with_genres: genreIds.join(","), sort_by: "popularity.desc" },
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data as { results: any[] };
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
