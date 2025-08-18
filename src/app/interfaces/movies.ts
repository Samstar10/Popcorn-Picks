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