export type MovieSummary = {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  genre_ids?: number[];
  popularity?: number;
};