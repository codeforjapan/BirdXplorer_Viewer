import type { Route } from "./+types/export.csv";

const API_BASE_URL =
  process.env.BIRDXPLORER_API_URL ?? "https://dev.api-birdxplorer.code4japan.org";

export async function loader({ request }: Route.LoaderArgs) {
  const incomingUrl = new URL(request.url);
  const apiUrl = new URL(`${API_BASE_URL}/api/v1/data/export/csv`);

  incomingUrl.searchParams.forEach((value, key) => {
    apiUrl.searchParams.append(key, value);
  });

  const headers: Record<string, string> = {};
  const apiKey = process.env.EXPORT_API_KEY;
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }

  const upstream = await fetch(apiUrl.toString(), { headers });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "text/csv; charset=utf-8",
      "Content-Disposition":
        upstream.headers.get("Content-Disposition") ??
        'attachment; filename="community_notes.csv"',
      "Cache-Control": "no-store",
    },
  });
}
