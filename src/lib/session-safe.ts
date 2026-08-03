import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Session segura: ignora falhas de auth/env, mas deixa o Next controlar rotas dinâmicas. */
export async function getOptionalSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Durante build estático, o Next lança isso — não engole como "sem sessão".
    if (message.includes("Dynamic server usage") || message.includes("DYNAMIC_SERVER_USAGE")) {
      throw error;
    }
    console.error("[gwen/session]", error);
    return null;
  }
}
