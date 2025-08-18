import { tmdbServer } from '@/app/services/api/tmdb-server';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data } = await tmdbServer.get(`/movie/${params.id}`, {
    params: { append_to_response: 'credits,release_dates' },
  });
  return NextResponse.json(data);
}
