import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const with_genres = searchParams.get("with_genres") ?? undefined;
  const sort_by = searchParams.get("sort_by") ?? "popularity.desc";
  const page = Number(searchParams.get("page") ?? "1");
  const { data } = await tmdbServer.get("/discover/movie", {
    params: { with_genres, sort_by, page },
  });
  return NextResponse.json(data, { 
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=240",
    }
  });
}
