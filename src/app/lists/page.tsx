import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import ListsClient from "./lists-client";

export default async function ListsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // send unauthenticated users to NextAuth's sign-in
    redirect("/api/auth/signin");
  }
  return <ListsClient />;
}
