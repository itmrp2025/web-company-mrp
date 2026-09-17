# Analisis Arsitektur & Struktur Kode — MRP Law Office Frontend

## 1. Gambaran Umum

Frontend **MRP Law Office** adalah aplikasi Next.js 16 (App Router) dengan dua zona utama:

| Zona | Route | Tujuan |
|------|-------|--------|
| **Public** | `[locale]/(public)/` | Website company profile (ID + EN) |
| **Admin** | `[locale]/admin/` | CMS dashboard untuk mengelola konten |

Dua zona dipisah oleh route group — tidak ada overlap konflik. Locale (`id`/`en`) adalah prefix wajib di semua route, ditangani oleh `next-intl`.

---

## 2. Stack Teknologi

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Next.js 16.3.3 (App Router, Server Components) |
| Bahasa | TypeScript 5.9 |
| i18n | next-intl 4.14 (routing + message) |
| Client state | Zustand 5 (auth store saja) |
| Server state | TanStack Query 5 (React Query) |
| HTTP client | Axios (dengan interceptor CSRF) |
| Forms | React Hook Form + Zod |
| Editor rich text | Tiptap 3 (dengan extension link/placeholder/text-align/underline) |
| UI primitives | Custom MUI-like (CVA + Tailwind) + shadcn/ui (Base UI) |
| Styling | Tailwind CSS v4 (CSS-first config via `@theme inline`) |
| Analytics | Custom `PageViewTracker` (server action / fetch ke backend) |
| Testing | Vitest + React Testing Library + Playwright |
| Lint/Format | ESLint 9 + Prettier + Husky + lint-staged |

---

## 3. Struktur Direktori

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                  # Locale wrapper (wajib)
│   │   ├── (public)/             # Route group: halaman publik
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── layout.tsx        # PublicLayout (Navbar + Footer)
│   │   │   ├── about/, services/, articles/, career/, contact/, dll.
│   │   │   └── maintenance/, unauthorized/
│   │   ├── (auth)/admin/login/   # Halaman login admin
│   │   ├── admin/                # Route group: dashboard CMS
│   │   │   ├── page.tsx          # Dashboard utama
│   │   │   ├── layout.tsx        # AdminSectionLayout → AdminLayout
│   │   │   ├── articles/, career/, faq/, gallery/, media/, reviews/, services/, team/
│   │   │   ├── pages/            # Editor halaman (home, about, dll.)
│   │   │   ├── settings/         # General + Navigation
│   │   │   ├── seo/, analytics/
│   │   │   └── not-found.tsx
│   │   ├── layout.tsx            # LocaleLayout (NextIntlClientProvider + QueryProvider + Toaster)
│   │   ├── error.tsx, not-found.tsx
│   │   └── api/proxy/[...path]/  # Backend proxy (SSR fetch ke lokal:8080)
│   ├── layout.tsx                # Root layout (metadata global)
│   ├── globals.css               # Design tokens + Tailwind v4 theme
│   ├── robots.ts, sitemap.ts
│   └── globals.css
├── components/
│   ├── admin/                    # Komponen CMS
│   │   ├── articles/             # ArticleForm, CategorySelect
│   │   ├── career/               # JobModal, ApplicationsDrawer, CareerDataPanel
│   │   ├── faq/                  # FaqDataPanel
│   │   ├── gallery/              # GalleryManager
│   │   ├── layout/               # AdminLayout, AdminSidebar, AdminTopbar
│   │   ├── pages/                # Editor halaman (HomePageEditor, AboutPageEditor, dll.)
│   │   ├── services/             # ServiceModal, ServicesDataPanel
│   │   ├── team/                 # TeamDataPanel, TeamMemberModal
│   │   ├── shared/               # ImageUpload, RichTextEditor
│   │   └── SessionHydrator.tsx   # Hydrate auth store dari /auth/admin/me
│   ├── custom-ui/                # Komponen basis: Button, Card, TextField, Chip, Avatar, Select
│   ├── public/                   # Komponen halaman publik
│   │   ├── layout/               # Navbar, Footer, LanguageSwitcher, PageHero
│   │   ├── sections/home/        # 10 section homepage (Hero, Stats, Services, dll.)
│   │   ├── sections/team/        # TeamGrid
│   │   ├── GalleryGrid, ImageLightbox, ReviewForm, ShareArticleModal, NotFoundContent
│   │   └── TeamGrid, TeamMemberModal
│   ├── analytics/                # PageViewTracker
│   └── providers/                # QueryProvider (TanStack Query)
├── config/
│   └── axios.config.ts           # Axios instance + interceptor (CSRF + toast error)
├── i18n/
│   ├── routing.ts                # next-intl routing config (id, en; default: en)
│   ├── navigation.ts             # TypedLink components (Link, useRouter, usePathname)
│   └── messages/
│       ├── id.json, en.json      # Translation messages
├── interface/
│   └── admin.interface.ts        # Semua TS types: ApiResponse, domain models, payload types
├── lib/
│   ├── fonts.ts                  # Playfair Display + Inter (variable fonts)
│   └── utils.ts                  # cn() utility (tailwind-merge + clsx)
├── proxy.ts                      # Next.js middleware: i18n routing + admin auth guard
├── store/
│   └── use-auth.ts               # Zustand store: user, isLoaded, setUser, isLogin, logout
└── utils/
    ├── constants/
    │   ├── endpoints.const.ts    # Semua path API (auth, team, services, articles, dll.)
    │   ├── pathnames.const.ts    # Pathname constants (home, admin login/dashboard)
    │   └── site.config.ts        # Site-wide config constants
    └── helpers/
        ├── getApi.ts             # Build URL: production pakai prefix /api/proxy, dev pakai NEXT_PUBLIC_API
        ├── serverFetch.ts        # SSR fetch ke backend (no-store, return json.data)
        ├── fetchCmsPage.ts       # Fetch CMS page sections (public pages)
        ├── getSectionContent()   # Helper ekstrak section dari array PageSection
        ├── cms()                 # Field accessor: content[field] || fallback
        ├── seo.ts                # buildMetadata() — gabungkan DB SEO + i18n fallback
        └── readingTime.ts        # Hitung reading time artikel
```

---

## 4. Alur Request & Data Flow

### 4.1 Request masuk → middleware

```
Browser → proxy.ts (middleware)
         ├─ Cek cookie access_token → proteksi route /admin (kecuali /admin/login)
         ├─ Cek sudah login → redirect dari /admin/login ke /admin
         └─ Lulus → next-intl routing (deteksi locale dari pathname)
```

Middleware melakukan **dual role**:
1. next-intl locale detection & redirect
2. Admin auth guard (optimistic — hanya cek keberadaan cookie, otorisasi sebenaranya di backend)

### 4.2 Public page (SSR)

```
Halaman public (SSG/SSR hybrid)
  → Server Component (async)
  → fetchCmsPage(slug)  — fetch ke backend via serverFetch / fetch langsung
  → getSectionContent(sections, key) — ekstrak field per section
  → render section components dengan content + locale
  → generateMetadata() → buildMetadata() — gabungkan DB SEO + i18n fallback
```

Homepage (`page.tsx`) adalah contoh paling jelas: fetch CMS sekali, ekstrak 9 section, pass ke masing-masing section component.

### 4.3 Admin page (CSR + TanStack Query)

```
Admin page (Client Component)
  → SessionHydrator (effect: GET /auth/admin/me → setUser di Zustand)
  → TanStack Query: useQuery / useMutation ke backend via axiosInterceptor
  → Optimistic update / invalidateQueries setelah mutate
  → Toast feedback via Sonner
```

Admin tidak pakai Server Components untuk form/interaksi — semua client-side.

### 4.4 API path

| Environment | Path | Catatan |
|-------------|------|---------|
| **Development** | `NEXT_PUBLIC_API` (default `http://localhost:8080`) | Frontend call langsung ke backend |
| **Production** | `NEXT_PUBLIC_API_PREFIX` (default `/api/proxy`) → `src/app/api/proxy/[...path]/route.ts` → backend | Proxy SSR di Next.js, menghindari CORS |

`getApi(path)` memilih salah satu berdasarkan `NEXT_PUBLIC_ENV === "PRODUCTION"`.

### 4.5 Admin proxy route

`src/app/api/proxy/[...path]/route.ts` adalah **catch-all proxy**: meneruskan method, headers, body dari request Next.js ke `API_INTERNAL_URL` (default `http://localhost:8080`), lalu return response wholesale. Dipakai di production agar frontend tidak call cross-origin ke backend.

---

## 5. Pola Desain yang Digunakan

### 5.1 Module pattern (CMS — Phase 2+)

Berasal dari referensi Asera Studioverse, tetapi di MRP Law **belum diimplementasi lengkap**. Pola yang seharusnya:

```
interface/     → TS types API shapes           ✓ (ada di admin.interface.ts)
modules/       → Zod schema + RHF + TanStack Query hooks  ✗ (belum ada, forms trực tiếp di component)
services/      → API query/mutation wrappers   ✗ (call axios langsung di component)
features/      → React components (table/form/modal)     ✓ (ada di components/admin/)
```

Realita: forms dan mutations langsung tertanam di component (mis. `ArticleForm.tsx`, `PageSectionEditor.tsx`). Tidak ada lapisan services terpisah atau custom hooks reusable.

### 5.2 Custom UI component system

Komponen `Button`, `TextField`, `Select`, `Card`, `Chip`, `Avatar` dibangun dengan **CVA (class-variance-authority)** + Tailwind, bukan MUI. Ini dioptimasi untuk desain brand MRP (emerald `#0A664A`, teal accent `#24BA8D`).

### 5.3 CMS Page Section Editor

Pola editor berbasis schema: `SCHEMAS` array didefinisikan per halaman (mis. `HomePageEditor.tsx` punya 9 section definition, `AboutPageEditor.tsx` punya ~6). Tiap section punya `key`, `label`, `fields[]`. Field types: `text`, `textarea`, `image` (dengan folder), `divider`.

Editor (`PageSectionEditor.tsx`) generic: render semua section untuk halaman tertentu, support toggle visibility, save per-section, draft state local.

### 5.4 Stateless CMS rendering (public)

Public page bersifat **fully static-renderable**: fetch CMS data di server, pass ke client component. Tidak ada hydratation data CMS di client. Section component receive `content` dan `locale` sebagai props.

### 5.5 Error handling pattern

- Axios interceptor: otomatis toast error dari response (bahasa sesuai status code)
- `serverFetch` / `fetchCmsPage`: return `null` bila gagal (fallback ke hardcoded/translation)
- `buildMetadata`: fallback ke translation bila DB SEO kosong/tidak reachable

---

## 6. Kekurangan & Kelemahan

### 6.1 Keamanan (Security)

| # | Masalah | Detail |
|---|---------|--------|
| **S1** | Admin auth guard hanya cek cookie keberadaan | Middleware cek `request.cookies.has("access_token")` — bukan validasi token. Backend tetap Authorize, tapi middleware bisa tertransfrom oleh cookie palsu/sisa. Seharusnya: verifikasi minimal expiry atau biarkan backend saja di endpoint. |
| **S2** | CSRF token disimpan di cookie `_csrf` (baca di client) | Bukan masalah fatal, tapi webhook/refresh otomatis dari interceptor (`x-csrf-token` response header → set cookie) bergantung pada backend selalu mengirim header ini di setiap response, termasuk error response. |
| **S3** | `SessionHydrator` expose user data di client state | Zustand store simpan `AdminUser` di memori (baik, tidak localStorage). Tapi `SessionHydrator` panggil `/auth/admin/me` setiap mount tanpa debounce — bila banyak admin page di SPA navigation, berulang kali fetch. |
| **S4** | `returnURL` di login bisa manipulasi | `resolveReturnPath` sudah whitelist `ADMIN_ROUTES` dan regex article edit — cukup baik. Tapi `ADMIN_ROUTES` adalah list hardcode yang bisa desync dari route group structure. Ada artikel edit yang hanya dicover oleh regex, bukan list. |

### 6.2 Struktur & Architecture

| # | Masalah | Detail |
|---|---------|--------|
| **A1** | Module pattern tidak diikuti | Seperti catatan di §5.1: tidak ada lapisan `services/` atau `modules/` (Zod+hook terpisah). Semua call API dan form logic tertanam di component. Sulit di-test, sulit di-reuse, dan melanggar pemisahan concern. |
| **A2** | Duplikasi definisi schema CMS | `HomePageEditor.tsx` punya `SCHEMAS` (532 baris), `AboutPageEditor.tsx` punya `SCHEMAS` sendiri, dst. Setiap halaman redefinisi field definitionnya sendiri — Tidak ada schema registry atau shared definition. Jika field berubah (mis. tambah field baru), harus edit di beberapa file. |
| **A3** | `PageSectionEditor.tsx` terlalu generic tapi tidak general-purpose | Component ini mengandalkan `endpoints.cms.adminPageSections(pageSlug)` dan `endpoints.cms.adminUpdateSection(sectionId)` — hardcoded ke CMS section API. Jika nanti ada entity lain dengan pola CRUD serupa, tidak bisa reuse tanpa copy-paste. |
| **A4** | Tidak ada error boundary per section | Homepage render 9 section component tanpa `error.tsx` lokal atau `React.ErrorBoundary`. Bila satu section crash (mis. parsing content gagal), seluruh halaman bisa turun. |
| **A5** | Duplikasi endpoint definition | `endpoints.const.ts` dan `api-mrp-law` backend (Go) harus di-sync manual. Tidak ada generated client atau tipe-safe contract. Salah satu berubah, frontend bisa error runtime. |

### 6.3 Data & State Management

| # | Masalah | Detail |
|---|---------|--------|
| **D1** | TanStack Query cache key tidak terstruktur | Query key seperti `["admin-articles"]`, `["admin-page-sections", pageSlug]` — flat string array tanpa namespace. Sulit trace, rentan typo, dan tidak ada convention yang konsisten. |
| **D2** | Zustand auth store tidak persist | Sengaja tidak persist (cookie HttpOnly adalah source of truth). Tapi `isLoaded` flag di store hanya di-set setelah `setUser` dipanggil — `SessionHydrator` butuh `isLoaded === false` untuk trigger fetch. Race condition kecil: bila component mount sebelum `SessionHydrator` effect jalan, `isLoaded` masih `false`, ada dua consumer bisa trigger doubled fetch bila consumer juga check `isLoaded`. |
| **D3** | `serverFetch` dan `fetchCmsPage` duplikasi logika | Keduanya fetch ke backend dengan pattern serupa (build URL, parse JSON, return `data`). `serverFetch` return `json.data as T`, `fetchCmsPage` return `(json.data as CmsPageData) ?? null`. Seharusnya ada satu helper `fetchApi<T>(path, { locale })` yang digunakan keduanya. |
| **D4** | Public page tidak cache CMS data | `fetchCmsPage` / `serverFetch` pakai `cache: "no-store"` — setiap request ke halaman public melakukan fetch ke backend. Untuk konten yang jarang berubah (cms page sections), ini boros. Seharusnya pakai `cache: "force-cache"` dengan revalidate time, atau paling tidak `stale-while-revalidate`. |

### 6.4 Code Quality & Maintainability

| # | Masalah | Detail |
|---|---------|--------|
| **C1** | Riot of inline string literals untuk i18n di public page | Homepage (`page.tsx`) dan sebagainya hardcode string concatenation seperti `cms(hero, "heading_id", ...)`. Akhir-akhir ini sulit di-maintain dan tidak konsisten dengan pattern `t()` dari next-intl. Lebih baik: setiap section punya namespace translation fallback. |
| **C2** | Tidak ada contract test atau integration test untuk API shape | Hanya vitest + React Testing Library (unit/component). Tidak ada test yang verifikasi `ArticlePayload` cocok dengan backend response, atau `buildMetadata` output. Risk: breaking change di backend tanpa terdeteksi. |
| **C3** | Admin layout sidebar navigation hardcode | `AdminSidebar.tsx` punya `navItems` array hardcode. Jika halaman admin baru ditambahkan (mis. `admin/reports`), sidebar harus diedit manual. Lebih baik dari config/routing. |
| **C4** | `ADMIN_ROUTES` di login page dan `navItems` di sidebar adalah duplikasi konfigurasi navigasi | Sama-sama hardcode list route admin. Seharusnya satu sumber kebenaran (mis. dari `src/interface/` atau const file). |
| **C5** | Form slug transformation di `ArticleForm.tsx` inline di `onChange` | `toLowerCase()`, replace whitespace → dash, strip leading dash. Logika ini harus di-zod refinement atau custom hook, bukan inside `onChange` handler yang bisa konflik dengan RHF internal state. |
| **C6** | Tidak ada loading skeleton / pending state yang konsisten | Admin page beberapa menggunakan inline "Memuat..." text, beberapa menggunakan TanStack Query default loading, beberapa tidak handle loading sama sekali. |
| **C7** | `RichTextEditor` dan `ImageUpload` tidak dikenal dari file yang dibaca | Berada di `components/admin/shared/`. Asumsi: komponen wrapper around Tiptap dan media upload. Tanpa baca, sulit bilang ada masalah apa. |

### 6.5 i18n & SEO

| # | Masalah | Detail |
|---|---------|--------|
| **I1** | Default locale adalah `en`, bukan `id` | Di `routing.ts`: `defaultLocale: "en"`. Untuk website hukum di Indonesia, `id` seharusnya default (atau least, sama-sama valid — ini preference). |
| **I2** | CMS sections content mix bahasa di satu JSON | `PageSection.content` adalah `Record<string, string>` dengan key seperti `heading_id`, `heading_en`. Ini pattern yang okay, tapi tidak ada validation bahwa kedua bahasa wajib ada — bisa ada section dengan hanya `heading_id` dan `heading_en` kosong. |
| **I3** | `buildMetadata` fallback bahasa hardcoded | Fallback dari translation (`getTranslations`) — bagus. Tapi canonical URL tetap pakai pattern `/ {locale} / {slug}` — jika ada page dengan custom canonical di DB, ditimpa. |
| **I4** | Sitemap dan robots.ts tidak dibaca | Hanya dasar. Tidak generate dari CMS data (mis. artikel yang dipublish). |

### 6.6 Testing & Quality Gates

| # | Masalah | Detail |
|---|---------|--------|
| **T1** | Tidak ada E2E test yang terbaca (Playwright ada di devDependencies) | Playwright 1.63 terpasang, tapi tidak ada folder `e2e/` atau test file yang terlihat dari struktur. Mungkin belum ditulis. |
| **T2** | `bun test` → vitest, tapi tidak ada test file yang terlihat | Dari tree, tidak ada `*.test.ts` atau `*.spec.ts` di `src/`. Mungkin di tempat lain atau belum ada. |
| **T3** | `prettier --write` di lint-staged untuk `*.md` | Tidak ada file markdown konten yang di-edit oleh developer (hanya CLAUDE.md dan README), jadi sebenarnya tidak masalah, tapi tidak terasa ada nilai. |

### 6.7 Production Readiness

| # | Masalah | Detail |
|---|---------|--------|
| **P1** | `API_INTERNAL_URL` hardcode fallback ke `http://localhost:8080` di banyak helper | `serverFetch.ts`, `fetchCmsPage.ts`, `SessionHydrator.tsx` semuanya fallback ke localhost:8080 bila env tidak set. Di production seharusnya Tesla error bila env tidak dikonfigurasi dengan benar, bukan silently fallback ke localhost. |
| **P2** | `getApi()` environment detection dari `NEXT_PUBLIC_ENV === "PRODUCTION"` | Ini cukup custom. Lebih umum: selalu pakai `NEXT_PUBLIC_API_PREFIX` di production dan `NEXT_PUBLIC_API` di development. Tidak butuh flag terpisah. |
| **P3** | `proxy.ts` matcher exclude `api/_next/_vercel/.*\\.\\..*` — regex mungkin terlalu ketat | Pattern `.*\\..*` di dalam negative lookahead sengaja nge-exclude file extension. Biasanya aman, tapi worth verify. |

---

## 7. Kekuatan (Kelebihan)

| # | Aspek | Catatan |
|---|-------|---------|
| **K1** | Struktur route sangat bersih | Route group `(public)/` dan `admin/` dipisah dengan jelas; locale `[locale]/` di level tertinggi. Mudah dimaintain. |
| **K2** | next-intl diintegrasikan konsisten | Semua halaman pakai `params: Promise<{ locale: string }>`, semua navigasi pakai `@/i18n/navigation`. Tidak ada next/navigation yang "kebetulan" dipakai di public page. |
| **K3** | Axios interceptor menangani CSRF + error toast secara terpusat | Satu tempat: request inject `_csrf` cookie, response extract `x-csrf-token`, error → toast otomatis. Tidak ada repetitive try/catch di component. |
| **K4** | Custom UI components konsisten dan typed | Button, TextField, Select semua pakai CVA + forwardRef + Tailwind. Bisa didokumentasi sebagai design system. |
| **K5** | SEO terkelola dari CMS | `buildMetadata()` gabungkan DB SEO + i18n fallback dengan per-field merge (bukan all-or-nothing). Fleksibel. |
| **K6** | TanStack Query dipakai tepat | Invalidasi ter-target (`invalidateQueries({ queryKey: [...] })`), bukan `clear()` atau `refetchQueries()` yang boros. |
| **K7** | Session hydrate pattern | `SessionHydrator` component yang render `null` tapi effect-check session — pattern yang umum dan efektif di SPAs. |

---

## 8. Rekomendasi Prioritas

| Priority | Fokus | Usulan |
|----------|-------|--------|
| **P0** | Keamanan admin auth | Middleware cukup redirect bila tidak ada cookie — sudah cukup untuk aktifkan proteksi. Tapi tambahkan komentar eksplisit bahwa validasi sesungguhnya ada di backend, jangan perlu logic di middleware. |
| **P0** | Caching CMS public pages | Ubah `cache: "no-store"` di `fetchCmsPage` menjadi `cache: "force-cache"` dengan `next: { revalidate: 3600 }` (atau sesuai frekuensi update). Ini pengaruhi performa dan biaya backend. |
| **P1** | Refaktor call API ke service layer | Ekstrak `axiosInterceptor` call dari component ke `src/services/`. Contoh: `src/services/articles.ts` export `getArticles()`, `createArticle()`, `updateArticle()`. Component tinggal panggil servicefunction + TanStack Query wrapper. |
| **P1** | SPA navigation doubled fetch di SessionHydrator | Tambahkan flag atau ensure `SessionHydrator` hanya fetch sekali per session. Bisa dengan `useRef` atau cek `isLoaded` sebelum fetch. |
| **P2** | Schema CMS registry | Keluarkan `SCHEMAS` dari `HomePageEditor.tsx`, `AboutPageEditor.tsx` ke file terpisah (`src/modules/cms/schemas.ts` atau `src/config/cms-schemas.ts`). Tiap halaman import bagian yang dibutuhkan. |
| **P2** | Query key convention | Naikkan ke `src/utils/queryKeys.ts` atau pola `["cms", "pageSections", pageSlug]`. Dokumentasi di CLAUDE.md. |
| **P2** | Single source of truth route list | Konsolidasi `ADMIN_ROUTES` (di login page) dan `navItems` (di sidebar) ke satu file const `src/utils/constants/admin-routes.ts`. |
| **P3** | Fallback error environment | Ganti fallback `http://localhost:8080` di production helper dengan error bila env tidak ada. |
| **P3** | Sitemap dinamis dari CMS | Generate `sitemap.ts` dari artikel yang dipublish + halaman CMS, bukan hardcode. |
| **P3** | E2E test untuk alur kritis | Login → dashboard → create article → publish → lihat di public page. |

---

## 9. Ringkasan Eksekutif

Aplikasi ini **sudah sangat solid untuk tahap development**. Struktur route, i18n, custom UI system, dan centralizer axios/CSRF sudah menunjukkan disiplin arsitektur. Kelemahan utamanya ada di:
1. **Belum ada lapisan services/module pattern** — semua logika call API tertanam di component
2. **Data fetching public pages tidak di-cache** — risiko performa dan beban backend
3. **Duplikasi konfigurasi** — route list, CMS schemas, endpoint definition tersebar tanpa registry
4. **Testing belum terbentuk** — Playwright dan vitest terpasang tapi belum ada test file

Dengan menambahkan service layer, caching yang tepat, dan query key convention, kode ini siap untuk scale ke lebih banyak fitur CMS tanpa refactor besar-besaran.
