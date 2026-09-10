import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Halaman admin dan route internal tidak perlu diindeks.
      disallow: ["/admin/", "/api/", "/id/admin/", "/en/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
