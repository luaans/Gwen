import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/entrar",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pessoas/:path*",
    "/diario/:path*",
    "/conversas/:path*",
    "/conversar/:path*",
    "/configuracoes/:path*",
    "/humor/:path*",
    "/lembrancas/:path*",
  ],
};
