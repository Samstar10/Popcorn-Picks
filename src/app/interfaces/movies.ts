export type MovieSummary = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  genre_ids?: number[];
  popularity?: number;
};

export type MoviesPageData = {
  results: MovieSummary[];
  page: number;
  total_pages: number;
  total_results?: number;
};

export type ListKind = "favorites" | "watchlist";

export type SavedMovie = {
  id: number;
  genre_ids?: number[];
  title: string;
  poster_path?: string;
  overview?: string;
  addedAt: number;
};

export type UserListsState = {
  favorites: Record<number, SavedMovie>;
  watchlist: Record<number, SavedMovie>;
};

export type TmdbGenre = { id: number; name: string };

export type CastMember = {
  cast_id: number;
  id: number;
  name: string;
  character: string;
};

export type Credits = { cast: CastMember[] };

export type MovieDetails = {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  genre_ids?: number[];
  vote_average?: number;
  genres?: TmdbGenre[];
  credits?: Credits;
};

export type RecData = { results: MovieSummary[] };