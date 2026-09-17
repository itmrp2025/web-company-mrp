import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { buildMetadata } from "@/utils/helpers/seo";

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    slug: "terms-conditions",
    locale,
    path: "/terms-conditions",
    fallback: {
      title:
        locale === "id" ? "Syarat & Ketentuan" : "Terms & Conditions",
      description:
        locale === "id"
          ? "Syarat dan Ketentuan penggunaan website MRP Law Office"
          : "Terms and Conditions for using MRP Law Office website",
    },
  });
}

// TODO: Pindahkan konten ke CMS via fetchCmsPage("terms-conditions") saat backend siap.

const content = {
  id: {
    badge: "Syarat & Ketentuan",
    heading: "Syarat & Ketentuan",
    subheading: "Terakhir diperbarui: September 2026",
    sections: [
      {
        title: "1. Penerimaan Ketentuan",
        body: "Dengan mengakses dan menggunakan website mrplawoffice.com (\"Website\"), Anda menyetujui dan terikat oleh Syarat & Ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, mohon untuk tidak melanjutkan penggunaan Website.",
      },
      {
        title: "2. Deskripsi Layanan",
        body: "Website ini milik dan dioperasikan oleh MRP Law Office. Website menyediakan informasi tentang layanan hukum, profil tim, artikel hukum, dan sarana komunikasi (formulir kontak, ulasan, lamaran kerja). Konten pada Website bersifat informatif dan bukan merupakan nasihat hukum.",
      },
      {
        title: "3. Bukan Nasihat Hukum",
        body: "Informasi yang disajikan di Website ini disediakan hanya untuk tujuan informasi umum. Tidak ada konten pada Website ini yang dapat dianggap sebagai nasihat hukum, atau menciptakan hubungan pengacara-klien antara Anda dan MRP Law Office. Untuk nasihat hukum yang spesifik, silakan hubungi kami secara langsung untuk konsultasi.",
      },
      {
        title: "4. Penggunaan Website",
        body: "Anda setuju untuk menggunakan Website ini hanya untuk tujuan yang sah dan tidak melanggar hukum. Anda dilarang:\n\n• Menggunakan Website untuk tujuan yang melanggar hukum atau peraturan yang berlaku.\n• Mengirimkan konten yang bersifat menyesatkan, memfitnah, mengancam, atau melanggar hak pihak lain.\n• Mencoba mengakses bagian Website yang tidak diperuntukkan bagi Anda.\n• Mengganggu atau merusak operasi Website.",
      },
      {
        title: "5. Hak Kekayaan Intelektual",
        body: "Seluruh konten pada Website ini — termasuk namun tidak terbatas pada teks, gambar, logo, desain, dan kode program — merupakan hak cipta dan kekayaan intelektual MRP Law Office atau pemberi lisensinya. Dilarang menyalin, mereproduksi, mendistribusikan, atau menggunakan konten tanpa izin tertulis dari kami.",
      },
      {
        title: "6. Formulir dan Pengiriman Data",
        body: "Dengan mengirimkan informasi melalui formulir kontak, ulasan klien, atau lamaran kerja di Website ini, Anda:\n\n• Menjamin bahwa informasi yang diberikan adalah benar dan akurat.\n• Menyetujui bahwa data Anda akan diproses sesuai Kebijakan Privasi kami.\n• Memahami bahwa ulasan klien akan ditinjau oleh tim kami sebelum dipublikasikan (moderasi).",
      },
      {
        title: "7. Tautan ke Situs Pihak Ketiga",
        body: "Website kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs web pihak ketiga tersebut. Mengakses tautan pihak ketiga sepenuhnya merupakan risiko Anda sendiri.",
      },
      {
        title: "8. Pembatasan Tanggung Jawab",
        body: "Kami berupaya menjaga agar informasi di Website tetap akurat dan terbaru, namun kami tidak memberikan jaminan atas kelengkapan, keakuratan, atau keandalan informasi tersebut. MRP Law Office tidak bertanggung jawab atas kerugian atau kerusakan yang timbul dari penggunaan atau ketidakmampuan menggunakan Website ini.",
      },
      {
        title: "9. Perubahan Ketentuan",
        body: "Kami berhak memperbarui atau mengubah Syarat & Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Perubahan berlaku efektif sejak dipublikasikan di halaman ini. Penggunaan berkelanjutan atas Website setelah perubahan dianggap sebagai penerimaan terhadap ketentuan yang diperbarui.",
      },
      {
        title: "10. Hukum yang Berlaku",
        body: "Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Segala sengketa yang timbul dari atau berkaitan dengan penggunaan Website ini akan diselesaikan melalui pengadilan yang berwenang di Jakarta, Indonesia.",
      },
      {
        title: "11. Kontak",
        body: "Jika Anda memiliki pertanyaan mengenai Syarat & Ketentuan ini, silakan hubungi kami:\n\nMRP Law Office\nDistrict 8, Prosperity Tower Lt. 5 Unit E & F\nSCBD Lot 28, Jl. Jend Sudirman Kav. 52-53, Jakarta Selatan\nEmail: info@mrplawoffice.com\nTelepon: (+62) 21 50300825",
      },
    ],
  },
  en: {
    badge: "Terms & Conditions",
    heading: "Terms & Conditions",
    subheading: "Last updated: September 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body: "By accessing and using the mrplawoffice.com website (\"Website\"), you agree to and are bound by these Terms & Conditions. If you do not agree to these terms, please do not continue using the Website.",
      },
      {
        title: "2. Description of Services",
        body: "This Website is owned and operated by MRP Law Office. The Website provides information about legal services, team profiles, legal articles, and communication tools (contact forms, reviews, job applications). Content on the Website is informational and does not constitute legal advice.",
      },
      {
        title: "3. Not Legal Advice",
        body: "Information presented on this Website is provided for general informational purposes only. No content on this Website shall be considered legal advice, or creates an attorney-client relationship between you and MRP Law Office. For specific legal advice, please contact us directly for a consultation.",
      },
      {
        title: "4. Website Usage",
        body: "You agree to use this Website only for lawful purposes. You are prohibited from:\n\n• Using the Website for purposes that violate applicable laws or regulations.\n• Submitting content that is misleading, defamatory, threatening, or infringes on the rights of others.\n• Attempting to access parts of the Website not intended for you.\n• Disrupting or damaging Website operations.",
      },
      {
        title: "5. Intellectual Property Rights",
        body: "All content on this Website — including but not limited to text, images, logos, designs, and program code — is the copyright and intellectual property of MRP Law Office or its licensors. It is prohibited to copy, reproduce, distribute, or use content without written permission from us.",
      },
      {
        title: "6. Forms and Data Submissions",
        body: "By submitting information through contact forms, client reviews, or job applications on this Website, you:\n\n• Warrant that the information provided is true and accurate.\n• Agree that your data will be processed in accordance with our Privacy Policy.\n• Understand that client reviews will be reviewed by our team before publication (moderation).",
      },
      {
        title: "7. Links to Third-Party Sites",
        body: "Our Website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of third-party websites. Accessing third-party links is entirely at your own risk.",
      },
      {
        title: "8. Limitation of Liability",
        body: "We strive to keep information on the Website accurate and current, but we make no guarantees regarding the completeness, accuracy, or reliability of such information. MRP Law Office is not liable for any loss or damage arising from the use or inability to use this Website.",
      },
      {
        title: "9. Changes to Terms",
        body: "We reserve the right to update or modify these Terms & Conditions at any time without prior notice. Changes become effective upon publication on this page. Continued use of the Website after changes constitutes acceptance of the updated terms.",
      },
      {
        title: "10. Governing Law",
        body: "These Terms & Conditions are governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes arising from or related to the use of this Website shall be resolved through the competent courts in Jakarta, Indonesia.",
      },
      {
        title: "11. Contact",
        body: "If you have questions about these Terms & Conditions, please contact us:\n\nMRP Law Office\nDistrict 8, Prosperity Tower 5th Fl. Unit E & F\nSCBD Lot 28, Jl. Jend Sudirman Kav. 52-53, South Jakarta\nEmail: info@mrplawoffice.com\nPhone: (+62) 21 50300825",
      },
    ],
  },
};

export default async function TermsConditionsPage({
  params,
}: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = (locale === "en" ? "en" : "id") as keyof typeof content;
  const c = content[lang];

  return (
    <>
      <PageHero
        badge={c.badge}
        heading={c.heading}
        subheading={c.subheading}
        imageUrl="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80&auto=format&fit=crop"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {c.sections.map((s, i) => (
              <div key={i}>
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">
                  {s.title}
                </h2>
                <div className="whitespace-pre-line text-neutral-600 leading-relaxed">
                  {s.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
