"use client";

import { SavedMovie } from "@/app/interfaces/movies";
import { useLists } from "@/features/lists/store";
import { useSession, signIn } from "next-auth/react";

function IconHeart({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
      className={filled ? "fill-red-500" : "fill-none stroke-red-500"} strokeWidth="2">
      <path d="M12 21s-7.5-4.35-9.5-8.5A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9.5 7.5C19.5 16.65 12 21 12 21z"/>
    </svg>
  );
}
function IconBookmark({ filled }: { filled?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
      className={filled ? "fill-blue-600" : "fill-none stroke-blue-600"} strokeWidth="2">
      <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z"/>
    </svg>
  );
}

type BaseProps = { movie: Omit<SavedMovie, "addedAt">; className?: string; };

export function FavoriteButton({ movie, className }: BaseProps) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";
  const isIn = useLists((s) => s.isIn("favorites", movie.id));
  const toggle = useLists((s) => s.toggle);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthed) return signIn("github");           // gate: require auth
    toggle("favorites", movie);
  };

  return (
    <button
      type="button"
      aria-pressed={isIn}
      aria-label={isIn ? "Remove from favorites" : "Add to favorites"}
      onClick={onClick}
      title={isAuthed ? undefined : "Sign in to save favorites"}
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-red-50 ${className ?? ""}`}
      data-testid="btn-favorite"
    >
      <IconHeart filled={isIn} />
      <span className="hidden sm:inline">{isIn ? "Favorited" : "Favorite"}</span>
    </button>
  );
}

export function WatchlistButton({ movie, className }: BaseProps) {
  const { status } = useSession();
  const isAuthed = status === "authenticated";
  const isIn = useLists((s) => s.isIn("watchlist", movie.id));
  const toggle = useLists((s) => s.toggle);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthed) return signIn("github");           // gate: require auth
    toggle("watchlist", movie);
  };

  return (
    <button
      type="button"
      aria-pressed={isIn}
      aria-label={isIn ? "Remove from watchlist" : "Add to watchlist"}
      onClick={onClick}
      title={isAuthed ? undefined : "Sign in to save to watchlist"}
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-blue-50 ${className ?? ""}`}
      data-testid="btn-watchlist"
    >
      <IconBookmark filled={isIn} />
      <span className="hidden sm:inline">{isIn ? "In Watchlist" : "Watchlist"}</span>
    </button>
  );
}
