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