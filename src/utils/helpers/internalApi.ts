export function getInternalApiUrl(): string {
  const url = process.env.API_INTERNAL_URL;
  if (url) return url;

  if (process.env.NODE_ENV === "production") {
    throw new Error("API_INTERNAL_URL belum diset");
  }
  return "http://localhost:8080";
}