# Ringkasan Implementasi PolicyModal & Checkbox Persetujuan Form

## 1. Komponen Reusable `PolicyModal`
- **File**: `src/components/public/PolicyModal.tsx`
- **Fitur**:
  - Mendukung slug `"privacy-policy"` dan `"terms-conditions"`.
  - Mengambil data section dari endpoint CMS (`/cms/pages/:slug`) secara client-side.
  - Memiliki fallback konten lokal jika CMS section belum terisi/offline.
  - Container berukuran max `max-h-[85vh]` dengan area isi `max-h-[60vh] overflow-y-auto`.
  - Di footer modal terdapat link `"Baca versi lengkap di tab baru"` mengarah ke `/privacy-policy` atau `/terms-conditions` (`target="_blank"`).
  - Menyediakan tombol `"Saya Setuju"` (jika `onAgree` diberikan) dan tombol `"Tutup"`.
  - Mengatur `document.body.style.overflow = "hidden"`, mendengarkan tombol `Escape`, dan menutup saat klik area backdrop.

---

## 2. Trigger Modal di Footer
- **File**: `src/components/public/layout/Footer.tsx`
- **Perubahan**:
  - Mengubah link `Privacy Policy` dan `Terms & Conditions` dari `<Link>` navigasi menjadi `<button>` trigger modal.
  - Mengelola state `modalSlug` (`privacy-policy` | `terms-conditions` | `null`).
  - Halaman penuh `/privacy-policy` dan `/terms-conditions` tetap dipertahankan untuk kebutuhan SEO / rujukan lengkap.

---

## 3. Checkbox Wajib di Form Contact Us & Career
- **File Contact Us**: `src/app/[locale]/(public)/contact/ContactClient.tsx`
- **File Career**: `src/app/[locale]/(public)/career/[slug]/page.tsx`
- **Fitur Form**:
  - Menambahkan checkbox required: *"Saya telah membaca dan menyetujui [Kebijakan Privasi] dan [Syarat & Ketentuan]"*.
  - Link `[Kebijakan Privasi]` dan `[Syarat & Ketentuan]` di dalam label inline membuka `PolicyModal` tanpa keluar dari form.
  - Jika modal dibuka dari form, mengklik tombol `"Saya Setuju"` di dalam modal akan otomatis mencentang checkbox form.
  - Tombol **Submit** dalam keadaan `disabled` hingga checkbox dicentang.
  - Handlers `handleSubmit` melakukan pengecekan ulang state `policyAgreed`. Jika somehow submit terpicu tanpa centang, proses dibatalkan dengan pesan error merah di dekat checkbox & toast.
  - State `policyAgreed` dan error di-reset otomatis ke `false`/`null` setelah submit sukses.

---

## 4. Rekomendasi Field Backend untuk Compliance (Opsional / Pendukung)

Untuk memenuhi standar kepatuhan perlindungan data pribadi (seperti **UU PDP Indonesia** / **GDPR** audit trail), jika Anda ingin menyimpan bukti persetujuan pengguna di database backend pada tahap berikutnya, berikut rekomendasi perubahan backend yang perlu disiapkan:

### A. Tabel `form_submissions` (Form Contact Us)
- **Model**: `app/models/form_submission.go` (atau struct payload `SubmitContactForm`)
- **Rekomendasi Field Tambahan**:
  1. `policy_agreed_at` (`*time.Time` / `TIMESTAMP`): Mencatat waktu pasti pengguna mencentang/menyetujui kebijakan.
  2. `policy_version` (`string`): Versi dokumen kebijakan saat disetujui (misal `"2026-09-v1"`).

### B. Tabel `job_applications` (Form Karir)
- **Model**: `app/models/job_application.go` (`JobApplication`)
- **Rekomendasi Field Tambahan**:
  1. `policy_agreed_at` (`*time.Time` / `TIMESTAMP`): Waktu persetujuan syarat & privasi oleh pelamar.
  2. `policy_version` (`string`): Identifikasi versi dokumen yang disetujui.

*(Sisi backend ini belum diimplementasikan saat ini sesuai arahan, hanya disiapkan sebagai cetak biru jika Anda ingin mengaktifkan pencatatan audit trail).*
