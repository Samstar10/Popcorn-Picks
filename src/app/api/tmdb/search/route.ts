import { NextResponse } from 'next/server';
import { tmdbServer } from '../../../services/api/tmdb-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') ?? '';
  const page  = searchParams.get('page')  ?? '1';
  const { data } = await tmdbServer.get('/search/movie', { params: { query, page } });
  return NextResponse.json(data, { 
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
    } 
  });
}
