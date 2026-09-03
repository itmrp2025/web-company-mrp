export interface PageSection {
  id: string;
  section_key: string;
  is_visible: boolean;
  content: Record<string, string>;
}

export interface CmsPageData {
  sections: PageSection[];
}

export async function fetchCmsPage(slug: string): Promise<CmsPageData | null> {
  try {
    const base = process.env.API_INTERNAL_URL ?? "http://localhost:8080";
    const ver = process.env.NEXT_PUBLIC_VERSION_API ?? "v1";
    const res = await fetch(`${base}/${ver}/cms/pages/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as CmsPageData) ?? null;
  } catch {
    return null;
  }
}

export function getSectionContent(
  sections: PageSection[] | undefined,
  key: string
): Record<string, string> {
  return sections?.find((s) => s.section_key === key)?.content ?? {};
}

export function cms(
  content: Record<string, string>,
  field: string,
  fallback: string = ""
): string {
  return content[field] || fallback;
}
