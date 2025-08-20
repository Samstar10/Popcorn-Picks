/// <reference types="jest" />

// 1) Mock FIRST and have create() return an instance that already has `get`
jest.mock('axios', () => {
  const get = jest.fn();                    // instance method we’ll use in tests
  const create = jest.fn(() => ({ get }));  // return instance with get
  return {
    __esModule: true,
    default: { create },                    // axios.default.create
  };
});

// 2) Now import after the mock is set up
import axios from 'axios';
import {
  fetchPopular,
  searchMovies,
  fetchDetails,
  fetchSimilar,
  fetchRecommendationsByGenresPaged,
  fetchDiscoverMoviesPaged,
} from '@/app/services/api/tmdb';

type MockedAxios = typeof axios & { create: jest.Mock };
const mockedAxios = axios as unknown as MockedAxios;

// Helper to access the instance `.get` that create() returned at module load
function getInstanceGet(): jest.Mock {
  // first created instance (the one used in tmdb.ts at import time)
  const created = mockedAxios.create.mock.results[0]?.value as { get: jest.Mock } | undefined;
  if (!created?.get) throw new Error('axios.create was not called or instance.get missing');
  return created.get;
}

beforeEach(() => {
  // reset calls on the existing instance get
  const instanceGet = getInstanceGet();
  instanceGet.mockReset();
});

test('fetchPopular hits /popular with page', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { results: [], page: 1, total_pages: 10 } });

  const res = await fetchPopular(2);

  expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: '/api/tmdb' });
  expect(instanceGet).toHaveBeenCalledWith('/popular', { params: { page: 2 } });
  expect(res.page).toBe(1);
});

test('searchMovies sends query + page', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { results: [], page: 1, total_pages: 1 } });

  await searchMovies('dune', 3);

  expect(instanceGet).toHaveBeenCalledWith('/search', { params: { query: 'dune', page: 3 } });
});

test('fetchDetails uses /movie/:id', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { id: 42, title: 'Dune' } });

  const res = await fetchDetails('42');

  expect(instanceGet).toHaveBeenCalledWith('/movie/42');
  expect(res.id).toBe(42);
});

test('fetchSimilar uses /movie/:id/similar', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { results: [1, 2], page: 1, total_pages: 1 } });

  await fetchSimilar('99');

  expect(instanceGet).toHaveBeenCalledWith('/movie/99/similar');
});

test('fetchRecommendationsByGenresPaged joins ids', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { results: [], page: 1, total_pages: 1 } });

  await fetchRecommendationsByGenresPaged([878, 12], 4);

  expect(instanceGet).toHaveBeenCalledWith('/discover', {
    params: { with_genres: '878,12', sort_by: 'popularity.desc', page: 4 },
  });
});

test('fetchDiscoverMoviesPaged formats params', async () => {
  const instanceGet = getInstanceGet();
  instanceGet.mockResolvedValueOnce({ data: { results: [], page: 5, total_pages: 7 } });

  await fetchDiscoverMoviesPaged({ genre: 28, sortBy: 'vote_average.desc', page: 5 });

  expect(instanceGet).toHaveBeenCalledWith('/discover', {
    params: { with_genres: '28', sort_by: 'vote_average.desc', page: 5 },
  });
});
