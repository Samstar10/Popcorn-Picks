/// <reference types="jest" />
import { act } from '@testing-library/react'
import { useLists } from '@/features/lists/store'
import type { SavedMovie } from '@/app/interfaces/movies'

afterEach(() => {
  // fresh state every test
  // @ts-ignore
  useLists.setState({ favorites: {}, watchlist: {} })
  jest.restoreAllMocks()
})

const dune: Omit<SavedMovie, 'addedAt'> = {
  id: 42, title: 'Dune', poster_path: '/x.jpg', overview: '…', genre_ids: [878, 12]
}
const dune2: Omit<SavedMovie, 'addedAt'> = {
  id: 43, title: 'Dune 2', poster_path: '/y.jpg', overview: '…', genre_ids: [878]
}

test('list returns most recent first', () => {
  const nowSpy = jest.spyOn(Date, 'now')
  nowSpy.mockReturnValueOnce(1000) // first add
  nowSpy.mockReturnValueOnce(2000) // second add (newer)

  act(() => {
    useLists.getState().add('favorites', dune)
    useLists.getState().add('favorites', dune2)
  })

  const list = useLists.getState().list('favorites')
  expect(list.map(m => m.id)).toEqual([43, 42]) // newest first
})
