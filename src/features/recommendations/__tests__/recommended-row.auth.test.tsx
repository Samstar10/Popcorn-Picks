/// <reference types="jest" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import RecommendedRow from '@/features/recommendations/recommended-row';
import { useLists } from '@/features/lists/store';
import type { MoviesPageData, SavedMovie } from '@/app/interfaces/movies';

/** ---- Types for the mocked HorizontalRow props ---- */
type RowProps = {
  title: string;
  enabled?: boolean;
  fetchPage: (page: number) => Promise<MoviesPageData>;
  queryKey: (page?: number) => (string | number | string[])[];
};

const calls: RowProps[] = [];

/** Mock HorizontalRow with proper typing + displayName */
jest.mock('@/features/rows/horizontal-row', () => {
  const MockHorizontalRow = (props: RowProps) => {
    calls.push(props);
    return <div data-testid="recs-proxy">{props.title}</div>;
  };
  (MockHorizontalRow as React.FC).displayName = 'MockHorizontalRow';
  return {
    __esModule: true,
    default: MockHorizontalRow,
  };
});

/** Force authenticated session so RecommendedRow renders */
jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react');
  return {
    ...actual,
    useSession: () => ({
      data: { user: { name: 'Dev' }, expires: '2999-01-01T00:00:00Z' },
      status: 'authenticated' as const,
    }),
  };
});

describe('RecommendedRow (authenticated)', () => {
  beforeEach(() => {
    calls.length = 0;

    // Seed lists with items that have genre_ids
    const now = Date.now();
    const favorites: Record<number, SavedMovie> = {
      1: { id: 1, title: 'Fav', addedAt: now, genre_ids: [28, 35] },
    };
    const watchlist: Record<number, SavedMovie> = {
      2: { id: 2, title: 'Watch', addedAt: now - 1, genre_ids: [28, 18] },
    };

    useLists.setState((prev) => ({
      ...prev,
      favorites,
      watchlist,
    }));
  });

  it('renders and builds recommendations key from top genres', async () => {
    render(<RecommendedRow />);

    expect(await screen.findByTestId('recs-proxy')).toHaveTextContent(
      'Recommended For You'
    );

    const [{ queryKey }] = calls;
    const key = queryKey();

    expect(key[0]).toBe('recs');
    expect(Array.isArray(key[1])).toBe(true);

    // Accept string[] or number[] and coerce to numbers to verify content
    const raw = key[1] as (string | number)[];
    const asNumbers = raw.map((v) => (typeof v === 'string' ? Number(v) : v));

    expect(asNumbers.length).toBeGreaterThan(0);
    expect(asNumbers.every((n) => Number.isFinite(n))).toBe(true);

    // Our seeded lists include genre 28 — ensure it made it into the key
    expect(asNumbers).toContain(28);
  });
});
