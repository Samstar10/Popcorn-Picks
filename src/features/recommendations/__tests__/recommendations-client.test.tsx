/// <reference types="jest" />
import { expect } from '@jest/globals';
import { renderWithProviders, screen } from '@/test/test-utils'
import { useLists } from '@/features/lists/store'
import * as api from '@/app/services/api/tmdb'
import { RecommendationsClient } from '../client';

jest.mock('@/app/services/api/tmdb')

beforeEach(() => {
  // seed the store with items having genre_ids
  const { add } = useLists.getState() as any
  // @ts-ignore
  useLists.setState({ favorites: {}, watchlist: {} })
  add('favorites', { id: 1, title: 'A', overview: '', poster_path: '', genre_ids: [28], })
  add('watchlist', { id: 2, title: 'B', overview: '', poster_path: '', genre_ids: [28, 878], })
})

test('renders recommended section from top genres', async () => {
  // mock API response
  (api.fetchRecommendationsByGenres as jest.Mock).mockResolvedValue({
    results: [{ id: 9, title: 'Rec 1' }, { id: 10, title: 'Rec 2' }]
  })

  renderWithProviders(<RecommendationsClient />)

  expect(await screen.findByText(/Recommended For You/i)).toBeInTheDocument()
  // One of the recommended titles should render as a link card
  expect(await screen.findByRole('link', { name: /rec 1/i })).toBeInTheDocument()
})
