import { Suspense } from "react";
import MovieDetailsClient from "./movie-details";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MovieDetailsClient id={id} />
    </Suspense>
  );
}
