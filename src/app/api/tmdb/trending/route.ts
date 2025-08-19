import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");

  const { data } = await tmdbServer.get("/trending/movie/day", {
    params: { page },
  });

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
