import { readFileSync, writeFileSync } from "fs";

const id = JSON.parse(readFileSync("./src/i18n/messages/id.json", "utf8"));
const en = JSON.parse(readFileSync("./src/i18n/messages/en.json", "utf8"));

const bioExtID = {
  dodi_bio: "Founder dan Managing Partner MRP Law Office dengan pengalaman lebih dari 20 tahun di bidang hukum korporat dan internasional. Beliau telah menangani ratusan kasus besar di pengadilan niaga dan arbitrase internasional, serta menjadi konsultan hukum bagi berbagai perusahaan multinasional yang beroperasi di Indonesia.",
  tabrani_bio: "Senior Associate dengan keahlian mendalam di bidang advokasi, mediasi, dan pengelolaan kepailitan. Berpengalaman sebagai kurator dalam berbagai perkara kepailitan besar dan mediator bersertifikat dari Mahkamah Agung RI.",
  purwadi_bio: "Spesialis hukum perbankan dan kepailitan dengan rekam jejak kuat di berbagai kasus keuangan kompleks. Telah mendampingi sejumlah bank besar dalam proses restrukturisasi kredit dan penyelesaian sengketa perbankan.",
  ahmad_bio: "Associate yang berfokus pada hukum perbankan dan litigasi komersial. Aktif menangani perkara perbankan dan sengketa bisnis di pengadilan negeri dan niaga Jakarta.",
  zefanya_bio: "Associate dengan keahlian di bidang hukum pidana dan perdata. Berpengalaman mendampingi klien korporasi maupun individu dalam perkara pidana ekonomi dan sengketa perdata kompleks.",
  evert_bio: "Associate spesialis hukum properti dan pertanahan. Berpengalaman dalam pengurusan sertifikasi tanah, sengketa kepemilikan, dan pendampingan transaksi properti komersial berskala besar.",
  galih_bio: "Associate dengan fokus pada hukum ketenagakerjaan dan korporat. Aktif mendampingi perusahaan dalam penyelesaian perselisihan hubungan industrial dan penyusunan regulasi internal perusahaan.",
  rahma_bio: "Junior Associate yang mendalami hukum keluarga dan perdata. Memberikan pendampingan hukum dalam perkara perceraian, waris, dan sengketa keluarga dengan pendekatan yang sensitif dan empatik.",
  raisha_bio: "Junior Associate dengan minat di bidang hukum digital dan kekayaan intelektual. Aktif membantu klien startup dalam perlindungan merek, kontrak teknologi, dan kepatuhan regulasi digital.",
  socials_label: "Sosial Media",
  view_profile: "Lihat profil lengkap",
  view_profile_short: "Lihat profil",
};

const bioExtEN = {
  dodi_bio: "Founder and Managing Partner of MRP Law Office with over 20 years of experience in corporate and international law. He has handled hundreds of major cases in commercial courts and international arbitration, and serves as legal counsel to various multinational companies operating in Indonesia.",
  tabrani_bio: "Senior Associate with deep expertise in advocacy, mediation, and bankruptcy administration. He is an experienced curator in major bankruptcy cases and a Supreme Court-certified mediator.",
  purwadi_bio: "Specialist in banking law and bankruptcy with a strong track record in complex financial cases. He has assisted major banks in credit restructuring processes and banking dispute resolution.",
  ahmad_bio: "Associate focused on banking law and commercial litigation. Actively handles banking cases and business disputes in Jakarta district and commercial courts.",
  zefanya_bio: "Associate with expertise in criminal and civil law. Experienced in representing corporate and individual clients in economic crime cases and complex civil disputes.",
  evert_bio: "Associate specializing in property and land law. Experienced in land certification, ownership disputes, and assistance in large-scale commercial property transactions.",
  galih_bio: "Associate focused on employment and corporate law. Actively assists companies in resolving industrial relations disputes and drafting internal company regulations.",
  rahma_bio: "Junior Associate specializing in family and civil law. Provides legal assistance in divorce, inheritance, and family disputes with a sensitive and empathetic approach.",
  raisha_bio: "Junior Associate with a focus on digital law and intellectual property. Actively assists startup clients with brand protection, technology contracts, and digital regulatory compliance.",
  socials_label: "Social Media",
  view_profile: "View full profile",
  view_profile_short: "View profile",
};

Object.assign(id.team, bioExtID);
Object.assign(en.team, bioExtEN);

// Add gallery namespace
id.gallery = {
  badge: "Dokumentasi Kegiatan",
  heading: "Galeri Firma",
  subheading: "Momen-momen kegiatan MRP Law Office dalam penanganan hukum, pelatihan, dan kegiatan komunitas.",
  all_categories: "Semua",
  categories: {
    litigation: "Persidangan",
    consultation: "Konsultasi",
    training: "Pelatihan & Seminar",
    award: "Penghargaan",
    community: "Kegiatan Komunitas",
  },
  photo_count: "foto",
  no_photos: "Belum ada foto di kategori ini.",
};

en.gallery = {
  badge: "Activity Documentation",
  heading: "Firm Gallery",
  subheading: "Moments from MRP Law Office activities in legal handling, training, and community events.",
  all_categories: "All",
  categories: {
    litigation: "Court Proceedings",
    consultation: "Consultation",
    training: "Training & Seminars",
    award: "Awards",
    community: "Community Events",
  },
  photo_count: "photos",
  no_photos: "No photos in this category yet.",
};

writeFileSync("./src/i18n/messages/id.json", JSON.stringify(id, null, 2), "utf8");
writeFileSync("./src/i18n/messages/en.json", JSON.stringify(en, null, 2), "utf8");

console.log("Done — team bio extended + gallery namespace added");
