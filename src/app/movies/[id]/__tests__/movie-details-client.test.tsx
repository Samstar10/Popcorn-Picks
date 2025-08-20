/// <reference types="jest" />
import { renderWithProviders, screen } from '@/test/test-utils'
import MovieDetailsClient from '@/app/movies/[id]/movie-details'
import * as api from '@/app/services/api/tmdb'

// Mock the TMDB service calls
jest.mock('@/app/services/api/tmdb')

// Mock next-auth/react so we can control auth state
jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react');
  return {
    ...actual,
    // We'll override useSession per test with mockReturnValue
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
    SessionProvider: ({ children }: any) => <>{children}</>,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});
import { useSession } from 'next-auth/react';

const details = {
  id: 7,
  title: 'Blade Runner',
  overview: 'Androids...',
  vote_average: 8.4,
  poster_path: '/a.jpg',
  backdrop_path: '/b.jpg',
  genres: [{ id: 878, name: 'Sci-Fi' }],
  credits: { cast: [{ cast_id: 1, name: 'Ford', character: 'Deckard' }] }
};

const similar = {
  results: [{ id: 71, title: 'Similar 1' }, { id: 72, title: 'Similar 2' }],
  page: 1, total_pages: 1
};

beforeEach(() => {
  (api.fetchDetails as jest.Mock).mockResolvedValue(details);
  (api.fetchSimilar as jest.Mock).mockResolvedValue(similar);
});

test('unauthenticated: shows sign in prompt, no similar grid', async () => {
  // unauth by default
  (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });

  renderWithProviders(<MovieDetailsClient id="7" />);

  expect(await screen.findByText('Blade Runner')).toBeInTheDocument();
  expect(screen.getByText(/Sign in to see personalized picks/i)).toBeInTheDocument();
});

test('authenticated: renders similar grid', async () => {
  (useSession as jest.Mock).mockReturnValue({
    data: { user: { name: 'Dev', email: 'dev@example.com' }, expires: '2999-01-01T00:00:00Z' },
    status: 'authenticated',
  });

  renderWithProviders(<MovieDetailsClient id="7" />);

  expect(await screen.findByText('Blade Runner')).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: /Similar 1/i })).toBeInTheDocument();
});
