/// <reference types="jest" />
import { renderWithProviders, screen } from "@/test/test-utils";
import { useLists } from "@/features/lists/store";
import * as api from "@/app/services/api/tmdb";
import { RecommendationsClient } from "../client";
import { act } from "@testing-library/react";

jest.mock("@/app/services/api/tmdb");

export function resetLists() {
  act(() => {
    // merge update (default replace = false)
    useLists.setState((prev) => ({
      ...prev,
      favorites: {},
      watchlist: {},
    }));
  });
}

beforeEach(() => {
  resetLists();
  const { add } = useLists.getState();
  add("favorites", {
    id: 1,
    title: "A",
    poster_path: "",
    overview: "",
    genre_ids: [28],
  });
  add("watchlist", {
    id: 2,
    title: "B",
    poster_path: "",
    overview: "",
    genre_ids: [28, 878],
  });
});

test("renders recommended section from top genres", async () => {
  (api.fetchRecommendationsByGenres as jest.Mock).mockResolvedValue({
    results: [
      { id: 9, title: "Rec 1" },
      { id: 10, title: "Rec 2" },
    ],
  });

  renderWithProviders(<RecommendationsClient />);

  expect(await screen.findByText(/Recommended For You/i)).toBeInTheDocument();
  expect(
    await screen.findByRole("link", { name: /rec 1/i })
  ).toBeInTheDocument();
});
