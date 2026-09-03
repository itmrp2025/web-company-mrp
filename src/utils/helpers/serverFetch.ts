const INTERNAL_URL = process.env.API_INTERNAL_URL ?? "http://localhost:8080";
const API_VERSION = process.env.NEXT_PUBLIC_VERSION_API ?? "v1";

export async function serverFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T | null> {
  try {
    const url = new URL(`${INTERNAL_URL}/${API_VERSION}${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}
