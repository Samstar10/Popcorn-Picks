import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await tmdbServer.get("/genre/movie/list");
  return NextResponse.json(data, { 
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=240",
    }
  });
}
