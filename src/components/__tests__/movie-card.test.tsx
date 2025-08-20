/// <reference types="jest" />

import { expect, describe, it } from '@jest/globals';
import { renderWithProviders, screen } from '@/test/test-utils'
import { MovieCard } from '@/components/movie-card'

describe('MovieCard', () => {
  it('renders title', () => {
    renderWithProviders(<MovieCard movie={{ id: 1, title: 'Inception' }} />)
    expect(screen.getByText('Inception')).toBeInTheDocument()
  })

  it('links to details page', () => {
    renderWithProviders(<MovieCard movie={{ id: 42, title: 'Dune' }} />)
    const link = screen.getByRole('link', { name: /dune/i })
    expect(link).toHaveAttribute('href', '/movies/42')
  })
})
