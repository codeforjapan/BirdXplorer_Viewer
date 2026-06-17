export function middleware(request: Request) {
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith("/export")) {
    return;
  }

  const user = process.env.EXPORT_BASIC_AUTH_USER;
  const pass = process.env.EXPORT_BASIC_AUTH_PASSWORD;
  if (!user || !pass) {
    return;
  }

  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");
  const expected = btoa(`${user}:${pass}`);
  if (scheme === "Basic" && encoded === expected) {
    return;
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="BirdXplorer Export"' },
  });
}

export const config = {
  matcher: ["/export/:path*"],
};
