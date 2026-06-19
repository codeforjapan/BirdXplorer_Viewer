export function checkBasicAuth(request: Request): Response | null {
  const user = process.env.EXPORT_BASIC_AUTH_USER;
  const pass = process.env.EXPORT_BASIC_AUTH_PASSWORD;
  if (!user || !pass) {
    return null;
  }

  const auth = request.headers.get("Authorization") ?? "";
  const [scheme, encoded] = auth.split(" ");
  const expected = btoa(`${user}:${pass}`);
  if (scheme === "Basic" && encoded === expected) {
    return null;
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="BirdXplorer Export"' },
  });
}
