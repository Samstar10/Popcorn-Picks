import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const with_genres = searchParams.get("with_genres") ?? "";
  const sort_by = searchParams.get("sort_by") ?? "popularity.desc";
  const { data } = await tmdbServer.get("/discover/movie", { params: { with_genres, sort_by } });
  return NextResponse.json(data, { status: 200 });
}
