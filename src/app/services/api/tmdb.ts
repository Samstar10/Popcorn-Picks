// import { MovieSummary } from "@/app/interfaces/movies";
// import axios, { AxiosError } from "axios";

// const TMDB = "https://api.themoviedb.org/3";

// const tmdb = axios.create({
//   baseURL: TMDB,
//   headers: {
//     Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
//     "Content-Type": "application/json;charset=utf-8",
//   },
// });

// tmdb.interceptors.response.use(
//   (response) => response, 
//   (error: AxiosError) => {
//     if (process.env.NODE_ENV === "development") {
//       console.error("TMDB API Error:", {
//         url: error.config?.url,
//         status: error.response?.status,
//         message: error.message,
//         data: error.response?.data,
//       });
//     }

//     return Promise.reject(
//       new Error(
//         (error.response?.data as any)?.status_message ||
//           error.message ||
//           "Unknown TMDB error"
//       )
//     );
//   }
// );

// export async function fetchPopular(page = 1) {
//   const { data } = await tmdb.get<{ results: MovieSummary[]; page: number; total_pages: number }>(
//     "/movie/popular",
//     { params: { page } }
//   );
//   return data;
// }

// export async function searchMovies(q: string, page = 1) {
//   const { data } = await tmdb.get<{ results: MovieSummary[]; page: number; total_pages: number }>(
//     "/search/movie",
//     { params: { query: q, page } }
//   );
//   return data;
// }

// export async function fetchDetails(id: string) {
//   const { data } = await tmdb.get(`/movie/${id}`, {
//     params: { append_to_response: "credits,release_dates" },
//   });
//   return data;
// }


import { MoviesPageData } from '@/app/interfaces/movies';
import axios from 'axios';

const api = axios.create({ baseURL: '/api/tmdb' });

// These run in the browser and hit *your* server routes above
export async function fetchPopular(page = 1) {
  const { data } = await api.get<MoviesPageData>('/popular', { params: { page } });
  return data;
}

export async function searchMovies(q: string, page = 1) {
  const { data } = await api.get<MoviesPageData>('/search', { params: { query: q, page } });
  return data;
}

export async function fetchDetails(id: string) {
  const { data } = await api.get(`/movie/${id}`);
  return data;
}
