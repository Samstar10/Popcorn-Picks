/// <reference types="jest" />
import { renderWithProviders, screen } from '@/test/test-utils'
import VerticalSearchResults from '@/features/search/vertical-results'

// Mock the data loader used inside the component
jest.mock('@/app/services/api/tmdb', () => ({
  __esModule: true,
  fetchSearchMoviesPaged: jest.fn().mockResolvedValue({
    results: [{ id: 9, title: 'Dune' }],
    page: 1,
    total_pages: 1,
  }),
}))

test('renders vertical search results for a query', async () => {
  renderWithProviders(<VerticalSearchResults query="dune" />)
  expect(await screen.findByText(/dune/i)).toBeInTheDocument()
})
