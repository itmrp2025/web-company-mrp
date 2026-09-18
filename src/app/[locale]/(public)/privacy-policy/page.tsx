import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { buildMetadata } from "@/utils/helpers/seo";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import DOMPurify from "isomorphic-dompurify";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    slug: "privacy-policy",
    locale,
    path: "/privacy-policy",
    fallback: {
      title: locale === "id" ? "Kebijakan Privasi" : "Privacy Policy",
      description:
        locale === "id"
          ? "Kebijakan Privasi MRP Law Office"
          : "MRP Law Office Privacy Policy",
    },
  });
}

export default async function PrivacyPolicyPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "en" ? "en" : "id") as "id" | "en";

  const cmsData = await fetchCmsPage("privacy-policy");
  const contentSection = getSectionContent(cmsData?.sections, "content");
  
  const heading = contentSection[`title_${lang}`] || (lang === "id" ? "Kebijakan Privasi" : "Privacy Policy");
  const bodyText = contentSection[`body_${lang}`] || "";
  
  const badge = lang === "id" ? "Kebijakan Privasi" : "Privacy Policy";
  const subheading = lang === "id" ? "Dokumen Legal" : "Legal Document";

  return (
    <>
      <PageHero
        badge={badge}
        heading={heading}
        subheading={subheading}
        imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format&fit=crop"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {bodyText ? (
            <div 
              className="text-neutral-600 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-neutral-900 [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-lg [&>h3]:font-medium [&>strong]:font-bold [&>p]:mb-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(bodyText) }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-neutral-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-neutral-500 font-medium">
                {lang === "id" ? "Konten sedang diperbarui" : "Content is being updated"}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
