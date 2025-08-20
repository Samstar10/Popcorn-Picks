/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import RecommendedRow from '@/features/recommendations/recommended-row'
import { useLists } from '@/features/lists/store'

// Mock HorizontalRow to confirm it renders and receives a queryKey
const calls: any[] = []
jest.mock('@/features/rows/horizontal-row', () => (props: any) => {
  calls.push(props)
  return <div data-testid="recs-proxy">{props.title}</div>
})

// Auth: force authenticated so the component is allowed to run fully
jest.mock('next-auth/react', () => {
  const actual = jest.requireActual('next-auth/react')
  return {
    ...actual,
    useSession: () => ({ data: { user: { name: 'Dev' }, expires: '2999' }, status: 'authenticated' as const })
  }
})

describe('RecommendedRow (authenticated)', () => {
  beforeEach(() => {
    calls.length = 0
    // Seed lists with items that have genre_ids
    useLists.setState({
      favorites: {
        1: { id: 1, title: 'Fav', addedAt: Date.now(), genre_ids: [28, 35] }
      },
      watchlist: {
        2: { id: 2, title: 'Watch', addedAt: Date.now() - 1, genre_ids: [28, 18] }
      }
    } as any)
  })

  it('renders and builds recommendations key from top genres', async () => {
    render(<RecommendedRow />)
    expect(await screen.findByTestId('recs-proxy')).toHaveTextContent('Recommended For You')

    const [{ queryKey }] = calls
    const key = queryKey()
    // top genres include 28; exact order may vary, but the structure should be stable
    expect(key[0]).toBe('recs')
    expect(Array.isArray(key[1])).toBe(true)
    expect((key[1] as number[]).length).toBeGreaterThan(0)
  })
})
