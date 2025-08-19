import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { data } = await tmdbServer.get(`/movie/${id}/similar`);
  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
    }
  });
}
