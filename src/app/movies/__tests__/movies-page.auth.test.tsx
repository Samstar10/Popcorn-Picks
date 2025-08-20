/// <reference types="jest" />
import { renderWithProviders, screen } from '@/test/test-utils'
import MoviesPage from '@/app/movies/page'

// Mock child components to keep it light
jest.mock('@/features/recommendations/recommended-row', () => () => <div data-testid="recs">RecommendedRow</div>)
jest.mock('@/features/rows/genre-row', () => (p: any) => <div>GenreRow {p.title}</div>)
jest.mock('@/features/rows/horizontal-row', () => (p: any) => <div>Row {p.title}</div>)
jest.mock('@/features/search/vertical-results', () => (p: any) => <div>Search: {p.query}</div>)

// API mocks
jest.mock('@/app/services/api/tmdb', () => ({
  __esModule: true,
  fetchGenres: jest.fn().mockResolvedValue([{ id: 28, name: 'Action' }]),
  fetchTrendingPaged: jest.fn().mockResolvedValue({ results: [], page: 1, total_pages: 1 }),
  fetchTopRatedPaged: jest.fn().mockResolvedValue({ results: [], page: 1, total_pages: 1 }),
}))

test('authenticated users see RecommendedRow', async () => {
  const session = { user: { name: 'Dev', email: 'dev@example.com' }, expires: '2999-01-01T00:00:00Z' }
  renderWithProviders(<MoviesPage />, { session })

  expect(await screen.findByText(/Popcorn Picks/i)).toBeInTheDocument()
  expect(await screen.findByTestId('recs')).toBeInTheDocument()
})
