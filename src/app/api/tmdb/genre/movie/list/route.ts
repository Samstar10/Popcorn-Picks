import { tmdbServer } from "@/app/services/api/tmdb-server";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await tmdbServer.get("/genre/movie/list");
  return NextResponse.json(data, { status: 200 });
}
