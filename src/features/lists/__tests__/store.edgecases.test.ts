/// <reference types="jest" />
import { useLists } from '@/features/lists/store'

beforeEach(() => {
  useLists.setState((s) => ({
    ...s,
    favorites: {},
    watchlist: {},
  }))
})

test('add duplicate keeps latest addedAt and no duplicates in map', () => {
  const { add, list } = useLists.getState()
  add('favorites', { id: 1, title: 'A' })
  const first = list('favorites')[0]
  add('favorites', { id: 1, title: 'A' })
  const after = list('favorites')[0]

  expect(after.id).toBe(1)
  expect(after.addedAt).toBeGreaterThanOrEqual(first.addedAt)
  expect(list('favorites').length).toBe(1)
})

test('remove non-existent is safe', () => {
  const { remove, list } = useLists.getState()
  remove('favorites', 999)
  expect(list('favorites').length).toBe(0)
})

test('toggle add then remove', () => {
  const { toggle, isIn } = useLists.getState()
  toggle('favorites', { id: 42, title: 'X' })
  expect(isIn('favorites', 42)).toBe(true)
  toggle('favorites', { id: 42, title: 'X' })
  expect(isIn('favorites', 42)).toBe(false)
})
