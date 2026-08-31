const isProduction = process.env.NEXT_PUBLIC_ENV === "PRODUCTION";

const API_BASE = isProduction
  ? (process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/proxy")
  : (process.env.NEXT_PUBLIC_API ?? "http://localhost:8080");

const API_VERSION = process.env.NEXT_PUBLIC_VERSION_API ?? "v1";

export function getApi(path: string): string {
  return `${API_BASE}/${API_VERSION}${path}`;
}
