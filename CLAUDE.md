# CLAUDE.md

Panduan untuk Claude Code saat bekerja di frontend `mrp-law-fe/`.

Ini adalah frontend Next.js untuk **MRP Law Office** — website company profile + CMS. Lihat `../prd.md` untuk spesifikasi lengkap. Struktur mengikuti pola referensi Asera Studioverse (`D:\development\asera\sewa studio\sewa-studio-fe`), dengan tambahan **next-intl** (i18n ID/EN) yang tidak ada di referensi.

## Commands

```bash
bun dev            # Start dev server on :3000
bun build          # Build produksi
bun lint           # ESLint fix
bun test           # vitest run
```

Next.js 16 mengganti `middleware.ts` menjadi **`src/proxy.ts`** — cek `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` sebelum menulis kode level-framework.

## Routing & i18n

- Semua halaman ada di `src/app/[locale]/` — locale wajib: `id` (default) atau `en` (`src/i18n/routing.ts`).
- `src/proxy.ts` menggabungkan **next-intl locale detection** + **admin auth guard** dalam satu middleware. Guard hanya memeriksa keberadaan cookie `access_token` (optimistic check) — otorisasi sebenarnya tetap di backend.
- Route groups: `(public)/` untuk halaman publik, `admin/` untuk CMS (protected).
- Gunakan `Link`, `useRouter`, `usePathname` dari `@/i18n/navigation` (bukan `next/navigation`) di halaman publik/admin agar locale-aware. Untuk baca query param gunakan `next/navigation`'s `useSearchParams` (tidak locale-dependent).

## Data Layer

- **Axios** (`src/config/axios.config.ts`) — `withCredentials: true`, inject `X-CSRF-Token` dari cookie `_csrf` pada mutasi, toast error otomatis via Sonner.
- **TanStack Query** untuk semua server state.
- `getApi(path)` (`src/utils/helpers/getApi.ts`) — build URL: dev pakai `NEXT_PUBLIC_API` langsung, production pakai `NEXT_PUBLIC_API_PREFIX` (proxy `/api/proxy/v1/...` → backend, lihat `src/app/api/proxy/[...path]/route.ts`).
- Response shape backend: `{success, message, data, meta?}` (lihat `api-mrp-law/app/utils/response.go`).

## Auth

- Zustand store `src/store/use-auth.ts` — hanya simpan `user` di memori (tidak persist ke localStorage, karena source of truth adalah HttpOnly cookie `access_token` dari backend).
- Login: `POST /v1/auth/admin/login` → backend set cookie HttpOnly → redirect ke `returnURL` atau `/admin`.
- **Tidak ada** HMAC API-KEY seperti referensi Asera (Phase 1 skip — admin-only auth, single origin). Tambahkan di Phase 2 jika diperlukan hardening tambahan.

## Module Pattern (untuk fitur CMS Phase 2+)

Ikuti pola 4-layer dari referensi:
1. `src/interface/` — TS types API shapes
2. `src/modules/` — Zod schema + React Hook Form + TanStack Query hooks
3. `src/services/` — API query/mutation wrappers
4. `src/features/` — komponen React (table/form/modal)

## UI

- **Custom MUI-like components** di `src/components/custom-ui/` (Button, Card, TextField, Chip, Avatar) — dibangun dengan `cva` + Tailwind, bukan `@mui/material`.
- **shadcn/ui** di `src/components/ui/` — generate via `bunx shadcn@latest add <component>` (base: Base UI, bukan Radix).
- Design tokens (brand MRP — emerald green `#0A664A`, teal accent `#24BA8D`) di `src/app/globals.css` via `@theme inline` (Tailwind v4 CSS-first).
- Path alias `@/` → `src/`.
- Font: Playfair Display (serif, heading) + Inter (sans, body) via `src/lib/fonts.ts`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
