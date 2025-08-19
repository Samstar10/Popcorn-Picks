"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import GithubPNG from "../../public/github.png";

export default function AuthButtons() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;

  return session ? (
    <div className="flex items-center gap-3">
      <button className="rounded border px-1 py-1 lg:px-4 lg:py-2 font-bold text-xs lg:text-base" onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <button className="rounded border px-1 py-1 lg:px-4 lg:py-2 flex text-xs lg:text-base items-center gap-2 font-bold" onClick={() => signIn("github")}>
      <Image 
        src={GithubPNG}
        alt="GitHub"
        width={24}
        height={24}
      />
      Sign in with GitHub
    </button>
  );
}
