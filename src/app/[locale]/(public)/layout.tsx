import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";
import { TanyaHakimBubble } from "@/components/public/TanyaHakimBubble";
import { fetchCmsPage, getSectionContent } from "@/utils/helpers/fetchCmsPage";
import { isSectionEnabled } from "@/utils/helpers/sectionVisibility";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cmsData = await fetchCmsPage("home");
  const bubble = getSectionContent(cmsData?.sections, "tanya_hakim_bubble");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {isSectionEnabled(bubble) && <TanyaHakimBubble content={bubble} />}
    </div>
  );
}