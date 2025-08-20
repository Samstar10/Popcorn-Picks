/// <reference types="jest" />
import React from 'react';
import { renderWithProviders, screen } from '@/test/test-utils';
import MovieDetailsClient from '@/app/movies/[id]/movie-details';
import type { MovieDetails, MoviesPageData } from '@/app/interfaces/movies';
import type { Session } from 'next-auth';

/* ---------------- Mock TMDB ----------------- */
jest.mock('@/app/services/api/tmdb', () => ({
  __esModule: true,
  ...jest.requireActual('@/app/services/api/tmdb'),
  fetchDetails: jest.fn(),
  fetchSimilar: jest.fn(),
}));
import * as api from '@/app/services/api/tmdb';
const mockedApi = api as jest.Mocked<typeof api>;

/* --------------- Mock NextAuth -------------- */
jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react');
  return {
    ...actual,
    useSession: jest.fn(),
    SessionProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});
import { useSession } from 'next-auth/react';
const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>;

/** Helpers that return the *correctly typed* shapes for useSession */
function unauthSession() {
  return {
    data: null,
    status: 'unauthenticated' as const,
    update: jest.fn(async () => null),
  };
}
function authSession(session: Session) {
  return {
    data: session,
    status: 'authenticated' as const,
    update: jest.fn(async () => session),
  };
}

/* ----------------- Fixtures ----------------- */
const details: MovieDetails = {
  id: 7,
  title: 'Blade Runner',
  overview: 'Androids...',
  vote_average: 8.4,
  poster_path: '/a.jpg',
  backdrop_path: '/b.jpg',
  genres: [{ id: 878, name: 'Sci-Fi' }],
  credits: { cast: [{ cast_id: 1, name: 'Ford', character: 'Deckard' }] } as MovieDetails['credits'],
};

const similar: MoviesPageData = {
  results: [
    { id: 71, title: 'Similar 1' },
    { id: 72, title: 'Similar 2' },
  ],
  page: 1,
  total_pages: 1,
};

beforeEach(() => {
  jest.resetAllMocks();
  mockedApi.fetchDetails.mockResolvedValue(details);
  mockedApi.fetchSimilar.mockResolvedValue(similar);
});

test('unauthenticated: shows sign in prompt, no similar grid', async () => {
  mockedUseSession.mockReturnValue(unauthSession());

  renderWithProviders(<MovieDetailsClient id="7" />);

  expect(await screen.findByText('Blade Runner')).toBeInTheDocument();
  expect(
    screen.getByText(/Sign in to see personalized picks/i)
  ).toBeInTheDocument();
});

test('authenticated: renders similar grid', async () => {
  const session: Session = {
    user: { name: 'Dev', email: 'dev@example.com' },
    expires: '2999-01-01T00:00:00Z',
  };
  mockedUseSession.mockReturnValue(authSession(session));

  renderWithProviders(<MovieDetailsClient id="7" />);

  expect(await screen.findByText('Blade Runner')).toBeInTheDocument();
  expect(
    await screen.findByRole('link', { name: /Similar 1/i })
  ).toBeInTheDocument();
});
