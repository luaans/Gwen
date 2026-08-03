import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Session segura: nunca derruba a página se auth/env falhar. */
export async function getOptionalSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error("[gwen/session]", error);
    return null;
  }
}
