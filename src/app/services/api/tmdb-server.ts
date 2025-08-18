import "server-only";
import axios from "axios";

export const tmdbServer = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});
