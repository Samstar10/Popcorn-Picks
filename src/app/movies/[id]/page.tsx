import { Suspense } from "react";
import MovieDetailsClient from "./movie-details";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <MovieDetailsClient id={params.id} />
    </Suspense>
  );
}