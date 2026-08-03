import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireOwnerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Não autorizado");
  }
  return session;
}
