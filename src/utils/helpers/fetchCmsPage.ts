import { serverFetch } from "@/utils/helpers/serverFetch";


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
  return serverFetch<CmsPageData>(`/cms/pages/${slug}`, undefined, {
    tags: ["cms", `cms:${slug}`],
  });
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
