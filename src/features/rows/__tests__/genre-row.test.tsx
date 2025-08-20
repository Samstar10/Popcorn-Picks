/// <reference types="jest" />
import React from "react";
import { render, screen } from "@testing-library/react";
import GenreRow from "@/features/rows/genre-row";
import type { MoviesPageData } from "@/app/interfaces/movies";

/** Props that HorizontalRow receives */
type RowProps = {
  title: string;
  enabled?: boolean;
  fetchPage: (page: number) => Promise<MoviesPageData>;
  queryKey: (page?: number) => (string | number | string[])[];
};

const rowCalls: RowProps[] = [];

/** Mock HorizontalRow with proper typing + displayName */
jest.mock("@/features/rows/horizontal-row", () => {
  const MockHorizontalRow = (props: RowProps) => {
    rowCalls.push(props);
    return <div data-testid="row-proxy">Row {props.title}</div>;
  };
  (MockHorizontalRow as React.FC).displayName = "MockHorizontalRow";
  return {
    __esModule: true,
    default: MockHorizontalRow,
  };
});

describe("GenreRow", () => {
  beforeEach(() => {
    rowCalls.length = 0;
  });

  it("renders title and wires fetchPage/queryKey correctly", async () => {
    render(<GenreRow genreId={28} title="Action" sortBy="popularity.desc" />);

    // Renders through the proxy
    expect(await screen.findByTestId("row-proxy")).toHaveTextContent(
      "Row Action"
    );

    // Check the props GenreRow built
    const [{ title, queryKey, fetchPage }] = rowCalls;
    expect(title).toBe("Action");
    expect(queryKey()).toEqual(["genre", 28, "popularity.desc"]);

    // Ensure fetchPage accepts a page number (returns a Promise-like)
    const maybePromise = fetchPage(2);
    expect(typeof (maybePromise as Promise<unknown>).then).toBe("function");
  });
});
