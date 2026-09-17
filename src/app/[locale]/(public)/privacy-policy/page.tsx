import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { PageHero } from "@/components/public/layout/PageHero";
import { buildMetadata } from "@/utils/helpers/seo";

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

// TODO: Pindahkan konten ke CMS via fetchCmsPage("privacy-policy") saat backend siap.
// Saat ini konten di-hardcode bilingual karena backend belum punya page "privacy-policy".

const content = {
  id: {
    badge: "Kebijakan Privasi",
    heading: "Kebijakan Privasi",
    subheading: "Terakhir diperbarui: September 2026",
    sections: [
      {
        title: "1. Pendahuluan",
        body: "MRP Law Office (\"Kami\") menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pribadi yang Anda berikan saat menggunakan website kami di mrplawoffice.com.",
      },
      {
        title: "2. Informasi yang Kami Kumpulkan",
        body: "Kami dapat mengumpulkan informasi berikut:\n\n• Informasi identitas: nama lengkap, alamat email, nomor telepon.\n• Informasi yang Anda berikan melalui formulir kontak, konsultasi, atau lamaran kerja.\n• Data teknis: alamat IP, jenis browser, halaman yang dikunjungi, waktu akses (dikumpulkan secara otomatis melalui cookie dan teknologi serupa).\n• Informasi dari ulasan atau testimoni yang Anda kirimkan.",
      },
      {
        title: "3. Penggunaan Informasi",
        body: "Informasi yang kami kumpulkan digunakan untuk:\n\n• Merespons pertanyaan dan permintaan konsultasi hukum Anda.\n• Memproses lamaran kerja.\n• Meningkatkan layanan dan pengalaman pengguna website.\n• Mengirimkan informasi terkait layanan kami (dengan persetujuan Anda).\n• Memenuhi kewajiban hukum yang berlaku.",
      },
      {
        title: "4. Perlindungan Data",
        body: "Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang wajar untuk melindungi informasi pribadi Anda dari akses tidak sah, pengungkapan, perubahan, atau penghancuran. Akses terhadap data pribadi dibatasi hanya kepada personel yang memerlukan untuk menjalankan tugasnya.",
      },
      {
        title: "5. Pembagian Informasi kepada Pihak Ketiga",
        body: "Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami dapat membagikan informasi hanya dalam kondisi:\n\n• Diperlukan untuk memenuhi kewajiban hukum atau perintah pengadilan.\n• Kepada penyedia layanan terpercaya yang membantu operasional website kami (hosting, analitik), dengan kewajiban kerahasiaan.\n• Dengan persetujuan eksplisit dari Anda.",
      },
      {
        title: "6. Cookie",
        body: "Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna dan menganalisis lalu lintas website. Anda dapat mengatur preferensi cookie melalui pengaturan browser Anda. Menonaktifkan cookie dapat mempengaruhi fungsionalitas tertentu dari website.",
      },
      {
        title: "7. Hak Anda",
        body: "Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP) yang berlaku di Indonesia, Anda berhak:\n\n• Mengakses informasi pribadi yang kami simpan tentang Anda.\n• Meminta koreksi atas informasi yang tidak akurat.\n• Meminta penghapusan informasi pribadi Anda.\n• Menarik persetujuan atas pengolahan data.\n\nUntuk menggunakan hak-hak tersebut, hubungi kami di info@mrplawoffice.com.",
      },
      {
        title: "8. Perubahan Kebijakan",
        body: "Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan dipublikasikan di halaman ini dengan tanggal pembaruan terbaru. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.",
      },
      {
        title: "9. Kontak",
        body: "Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami:\n\nMRP Law Office\nDistrict 8, Prosperity Tower Lt. 5 Unit E & F\nSCBD Lot 28, Jl. Jend Sudirman Kav. 52-53, Jakarta Selatan\nEmail: info@mrplawoffice.com\nTelepon: (+62) 21 50300825",
      },
    ],
  },
  en: {
    badge: "Privacy Policy",
    heading: "Privacy Policy",
    subheading: "Last updated: September 2026",
    sections: [
      {
        title: "1. Introduction",
        body: "MRP Law Office (\"We\") values your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website at mrplawoffice.com.",
      },
      {
        title: "2. Information We Collect",
        body: "We may collect the following information:\n\n• Identity information: full name, email address, phone number.\n• Information you provide through contact forms, consultations, or job applications.\n• Technical data: IP address, browser type, pages visited, access time (collected automatically through cookies and similar technologies).\n• Information from reviews or testimonials you submit.",
      },
      {
        title: "3. Use of Information",
        body: "The information we collect is used to:\n\n• Respond to your legal consultation inquiries and requests.\n• Process job applications.\n• Improve our services and website user experience.\n• Send information related to our services (with your consent).\n• Fulfill applicable legal obligations.",
      },
      {
        title: "4. Data Protection",
        body: "We implement reasonable technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Access to personal data is restricted to personnel who require it to perform their duties.",
      },
      {
        title: "5. Sharing Information with Third Parties",
        body: "We do not sell, trade, or rent your personal information to third parties. We may share information only under the following conditions:\n\n• Required to fulfill legal obligations or court orders.\n• With trusted service providers who assist in our website operations (hosting, analytics), under confidentiality obligations.\n• With your explicit consent.",
      },
      {
        title: "6. Cookies",
        body: "Our website uses cookies to enhance user experience and analyze website traffic. You can set your cookie preferences through your browser settings. Disabling cookies may affect certain website functionality.",
      },
      {
        title: "7. Your Rights",
        body: "In accordance with the Personal Data Protection Law (UU PDP) applicable in Indonesia, you have the right to:\n\n• Access personal information we hold about you.\n• Request correction of inaccurate information.\n• Request deletion of your personal information.\n• Withdraw consent for data processing.\n\nTo exercise these rights, contact us at info@mrplawoffice.com.",
      },
      {
        title: "8. Policy Changes",
        body: "We may update this Privacy Policy from time to time. Changes will be published on this page with the most recent update date. We recommend you review this page periodically.",
      },
      {
        title: "9. Contact",
        body: "If you have questions about this Privacy Policy, please contact us:\n\nMRP Law Office\nDistrict 8, Prosperity Tower 5th Fl. Unit E & F\nSCBD Lot 28, Jl. Jend Sudirman Kav. 52-53, South Jakarta\nEmail: info@mrplawoffice.com\nPhone: (+62) 21 50300825",
      },
    ],
  },
};

export default async function PrivacyPolicyPage({
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
