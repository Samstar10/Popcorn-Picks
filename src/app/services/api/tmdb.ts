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
  const { data } = await api.get<{ results: any[] }>(`/movie/${id}/similar`);
  return data;
}
