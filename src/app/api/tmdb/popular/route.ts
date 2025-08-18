import { NextResponse } from 'next/server';
import { tmdbServer } from '../../../services/api/tmdb-server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? '1';
  const { data } = await tmdbServer.get('/movie/popular', { params: { page } });
  return NextResponse.json(data, { status: 200 });
}
