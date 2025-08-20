/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import GenreRow from '@/features/rows/genre-row'

const rowCalls: any[] = []

// Mock HorizontalRow to capture props GenreRow passes down
jest.mock('@/features/rows/horizontal-row', () => (props: any) => {
  rowCalls.push(props)
  return <div data-testid="row-proxy">Row {props.title}</div>
})

describe('GenreRow', () => {
  beforeEach(() => { rowCalls.length = 0 })

  it('renders title and wires fetchPage/queryKey correctly', async () => {
    render(<GenreRow genreId={28} title="Action" sortBy="popularity.desc" />)

    // Renders through the proxy
    expect(await screen.findByTestId('row-proxy')).toHaveTextContent('Row Action')

    // Check the props GenreRow built
    const [{ title, queryKey, fetchPage }] = rowCalls
    expect(title).toBe('Action')
    expect(queryKey()).toEqual(['genre', 28, 'popularity.desc'])

    // Ensure fetchPage accepts a page number (smoke test — returns a Promise)
    const maybePromise = fetchPage(2)
    expect(typeof maybePromise?.then).toBe('function')
  })
})
