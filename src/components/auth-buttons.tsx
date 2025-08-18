"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  return session ? (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Hi, {session.user?.name ?? "you"}!</span>
      <button className="rounded border px-3 py-1" onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <button className="rounded border px-3 py-1" onClick={() => signIn("github")}>
      Sign in with GitHub
    </button>
  );
}
