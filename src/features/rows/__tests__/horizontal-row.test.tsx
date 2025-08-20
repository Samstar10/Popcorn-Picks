/// <reference types="jest" />
import { renderWithProviders, screen } from '@/test/test-utils'
import HorizontalRow from '@/features/rows/horizontal-row'
import type { MoviesPageData } from '@/app/interfaces/movies'

function page(n: number, total = 2): MoviesPageData {
  return {
    page: n,
    total_pages: total,
    results: Array.from({ length: 5 }, (_, i) => ({ id: n * 100 + i, title: `M${n}-${i}` }))
  }
}

test('renders items and fetches next page when sentinel intersects', async () => {
  const fetchPage = jest.fn()
    .mockResolvedValueOnce(page(1, 2))
    .mockResolvedValueOnce(page(2, 2))

  renderWithProviders(
    <HorizontalRow
      title="Trending"
      fetchPage={fetchPage}
      queryKey={() => ['trending']}
    />
  )

  // first page items
  expect(await screen.findByText('M1-0')).toBeInTheDocument()

  // trigger IO on sentinel
  const sentinel = document.querySelector('.w-1.shrink-0') as any
  expect(sentinel).toBeTruthy()
  // call mock IO hook attached in jest.setup
  sentinel.__ioTrigger__?.(true)

  // second page items
  expect(await screen.findByText('M2-0')).toBeInTheDocument()
})
