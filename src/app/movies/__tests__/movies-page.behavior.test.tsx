/// <reference types="jest" />
import { renderWithProviders, screen, fireEvent } from "@/test/test-utils";

// Force unauthenticated session for this behavior test
jest.mock("next-auth/react", () => {
  const actual = jest.requireActual("next-auth/react");
  return {
    ...actual,
    useSession: () => ({ data: null, status: "unauthenticated" as const }),
  };
});

import MoviesPage from "@/app/movies/page";

/** ---- Lightweight child mocks (with names + typed props) ---- */
jest.mock("@/features/recommendations/recommended-row", () => {
  const RecommendedRowMock = () => <div>RecommendedRow</div>;
  RecommendedRowMock.displayName = "RecommendedRowMock";
  return RecommendedRowMock;
});

jest.mock("@/features/rows/genre-row", () => {
  interface Props {
    title?: string;
  }
  const GenreRowMock = ({ title }: Props) => <div>GenreRow {title}</div>;
  GenreRowMock.displayName = "GenreRowMock";
  return GenreRowMock;
});

jest.mock("@/features/rows/horizontal-row", () => {
  interface Props {
    title?: string;
  }
  const HorizontalRowMock = ({ title }: Props) => <div>Row {title}</div>;
  HorizontalRowMock.displayName = "HorizontalRowMock";
  return HorizontalRowMock;
});

jest.mock("@/features/search/vertical-results", () => {
  interface Props {
    query?: string;
  }
  const VerticalResultsMock = ({ query }: Props) => <div>Search: {query}</div>;
  VerticalResultsMock.displayName = "VerticalResultsMock";
  return VerticalResultsMock;
});

/** ---- TMDB API mocks ---- */
jest.mock("@/app/services/api/tmdb", () => ({
  __esModule: true,
  fetchGenres: jest.fn(),
  fetchTrendingPaged: jest.fn(),
  fetchTopRatedPaged: jest.fn(),
}));

import * as api from "@/app/services/api/tmdb";
import { waitFor } from "@testing-library/react";

const mockedApi = api as jest.Mocked<typeof api>;

beforeEach(() => {
  jest.resetAllMocks();

  mockedApi.fetchGenres.mockResolvedValue([
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
  ]);

  // Provide at least one trending item with a backdrop so the hero renders
  mockedApi.fetchTrendingPaged.mockResolvedValue({
    results: [
      {
        id: 101,
        title: "Hero Movie",
        backdrop_path: "/hero.jpg",
        poster_path: "/hero-p.jpg",
        overview: "A hero overview",
        genre_ids: [28],
        popularity: 123,
      },
    ],
    page: 1,
    total_pages: 1,
  });

  mockedApi.fetchTopRatedPaged.mockResolvedValue({
    results: [],
    page: 1,
    total_pages: 1,
  });
});

test("initially shows hero (no search), then hides hero on search", async () => {
  renderWithProviders(<MoviesPage />);

  // Header becomes visible
  expect(await screen.findByText(/Popcorn Picks/i)).toBeInTheDocument();

  // Wait for the hero container to be in the DOM
  await waitFor(() =>
    expect(document.querySelector(".keen-slider")).toBeTruthy()
  );

  // Type in search
  const input = screen.getByPlaceholderText(/Search movies/i);
  fireEvent.change(input, { target: { value: "dune" } });

  // Now hero should disappear and search results show
  await waitFor(() =>
    expect(document.querySelector(".keen-slider")).toBeFalsy()
  );
  expect(await screen.findByText(/Search: dune/i)).toBeInTheDocument();
});
