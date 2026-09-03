import { readFileSync, writeFileSync } from "fs";

const id = JSON.parse(readFileSync("./src/i18n/messages/id.json", "utf8"));
const en = JSON.parse(readFileSync("./src/i18n/messages/en.json", "utf8"));

// Process section
id.process = {
  badge: "Cara Kerja Kami",
  heading: "Proses Penanganan yang Transparan",
  subheading: "Kami memastikan setiap klien memahami setiap tahap penanganan kasusnya secara penuh dan transparan.",
  steps: {
    "1": { title: "Konsultasi Awal", desc: "Diskusi mendalam tentang permasalahan hukum Anda. Kami mendengarkan, menganalisis, dan memberikan gambaran awal solusi." },
    "2": { title: "Kajian & Strategi", desc: "Tim kami melakukan kajian yuridis mendalam untuk merancang strategi hukum yang paling efektif dan efisien." },
    "3": { title: "Eksekusi", desc: "Pelaksanaan strategi dengan pendampingan penuh di setiap tahap — negosiasi, mediasi, maupun persidangan." },
    "4": { title: "Laporan & Tindak Lanjut", desc: "Laporan perkembangan berkala dan pendampingan pasca penyelesaian untuk memastikan kepentingan Anda terlindungi." },
  },
};

en.process = {
  badge: "How We Work",
  heading: "A Transparent Process You Can Trust",
  subheading: "We ensure every client fully understands every stage of their case handling transparently.",
  steps: {
    "1": { title: "Initial Consultation", desc: "In-depth discussion about your legal issues. We listen, analyze, and provide an initial overview of solutions." },
    "2": { title: "Review & Strategy", desc: "Our team conducts thorough legal review to design the most effective and efficient legal strategy." },
    "3": { title: "Execution", desc: "Strategy implementation with full accompaniment at every stage — negotiation, mediation, or court proceedings." },
    "4": { title: "Report & Follow-up", desc: "Periodic progress reports and post-settlement assistance to ensure your interests remain protected." },
  },
};

// Testimonials section
id.testimonials = {
  badge: "Kepercayaan Klien",
  heading: "Apa Kata Klien Kami",
  subheading: "Kepuasan dan kepercayaan klien adalah ukuran keberhasilan kami.",
  items: {
    "1": {
      quote: "MRP Law Office menangani kasus akuisisi perusahaan kami dengan sangat profesional. Due diligence yang menyeluruh dan negosiasi yang terampil menghasilkan kesepakatan terbaik untuk kami.",
      name: "Budi Santoso",
      position: "Direktur Utama PT Nusantara Makmur",
    },
    "2": {
      quote: "Tim MRP sangat responsif dan kompeten. Mereka memandu kami melewati proses litigasi yang kompleks dengan jelas dan percaya diri. Hasilnya melebihi ekspektasi kami.",
      name: "Dewi Rahayu",
      position: "CFO PT Teknologi Andalan",
    },
    "3": {
      quote: "Saya sangat terkesan dengan pengetahuan mendalam dan dedikasi tim MRP Law Office dalam menangani sengketa properti kami. Mereka benar-benar mitra hukum terpercaya.",
      name: "Hendro Wibowo",
      position: "Pemilik Wibowo Property Group",
    },
  },
};

en.testimonials = {
  badge: "Client Trust",
  heading: "What Our Clients Say",
  subheading: "Client satisfaction and trust are our measure of success.",
  items: {
    "1": {
      quote: "MRP Law Office handled our company acquisition very professionally. Their thorough due diligence and skilled negotiation resulted in the best deal for us.",
      name: "Budi Santoso",
      position: "President Director of PT Nusantara Makmur",
    },
    "2": {
      quote: "The MRP team was very responsive and competent. They guided us through a complex litigation process clearly and confidently. The results exceeded our expectations.",
      name: "Dewi Rahayu",
      position: "CFO of PT Teknologi Andalan",
    },
    "3": {
      quote: "I was very impressed by the deep knowledge and dedication of MRP Law Office's team in handling our property dispute. They are truly a trusted legal partner.",
      name: "Hendro Wibowo",
      position: "Owner of Wibowo Property Group",
    },
  },
};

// Recent articles preview
id.recentArticles = {
  badge: "Wawasan Hukum",
  heading: "Artikel & Publikasi Terkini",
  subheading: "Pemikiran dan analisis hukum terbaru dari para pengacara kami.",
  readMore: "Baca Artikel",
  viewAll: "Lihat Semua Artikel",
  minRead: "menit baca",
};

en.recentArticles = {
  badge: "Legal Insights",
  heading: "Latest Articles & Publications",
  subheading: "Latest legal thinking and analysis from our attorneys.",
  readMore: "Read Article",
  viewAll: "View All Articles",
  minRead: "min read",
};

// Update whyChoose to use icon cards format
id.whyChoose.reasons_v2 = {
  "0": { title: "Pengalaman 15+ Tahun", desc: "Track record yang terbukti menangani ribuan kasus di berbagai bidang hukum." },
  "1": { title: "Tim Multidisiplin", desc: "Pengacara spesialis di setiap bidang hukum untuk solusi yang tepat sasaran." },
  "2": { title: "Pendekatan Personal", desc: "Setiap klien mendapat perhatian penuh dan komunikasi langsung dengan pengacara senior." },
  "3": { title: "Jaringan Internasional", desc: "Kemitraan dengan firma hukum global untuk menangani perkara lintas batas." },
  "4": { title: "Strategi Berbasis Data", desc: "Analisis mendalam dan riset preseden untuk strategi yang solid dan dapat dipertanggungjawabkan." },
  "5": { title: "Transparansi Penuh", desc: "Laporan perkembangan berkala, biaya yang jelas, tanpa biaya tersembunyi." },
};

en.whyChoose.reasons_v2 = {
  "0": { title: "15+ Years Experience", desc: "Proven track record handling thousands of cases across various areas of law." },
  "1": { title: "Multidisciplinary Team", desc: "Specialist attorneys in every field of law for targeted and precise solutions." },
  "2": { title: "Personal Approach", desc: "Every client receives full attention and direct communication with senior attorneys." },
  "3": { title: "International Network", desc: "Partnerships with global law firms to handle cross-border matters." },
  "4": { title: "Data-Driven Strategy", desc: "In-depth analysis and precedent research for solid, accountable strategies." },
  "5": { title: "Full Transparency", desc: "Regular progress reports, clear fees, no hidden charges." },
};

writeFileSync("./src/i18n/messages/id.json", JSON.stringify(id, null, 2), "utf8");
writeFileSync("./src/i18n/messages/en.json", JSON.stringify(en, null, 2), "utf8");
console.log("Done — process, testimonials, recentArticles namespaces added");
