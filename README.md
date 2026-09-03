# FutureReady ITechno Cup Starter

Starter Next.js untuk membangun solusi digital yang inklusif, berkelanjutan, mudah dipelihara, dan stabil saat live demo.

## Mulai Cepat

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Yang Sudah Tersedia

- Next.js App Router dan TypeScript strict.
- Struktur feature-based Clean Architecture.
- Domain, use case, repository contract, in-memory adapter, dan placeholder Supabase.
- Zod validation dan Server Action.
- Loading, empty, error, not-found, dan success state.
- Health endpoint di `/api/health`.
- Unit test Vitest dan smoke test Playwright.
- Dokumentasi arsitektur, database, keamanan, testing, serta demo.

## Langkah Kustomisasi

1. Ubah `FutureReady` menjadi nama aplikasi.
2. Ganti fitur `example` dengan domain utama lomba.
3. Isi latar belakang, pengguna sasaran, pembeda, dan indikator SDG.
4. Konfigurasikan Supabase lalu ubah repository factory.
5. Tambahkan autentikasi serta authorization.
6. Buat screenshot desktop dan mobile pada `public/screenshots`.
7. Lengkapi identitas tim, demo URL, dan atribusi aset.

## Struktur

```text
src/app          Routing dan composition root
src/features     Modul bisnis per fitur
src/shared       UI dan utilitas generik
src/config       Konfigurasi tervalidasi
docs             Arsitektur dan kesiapan lomba
tests            Unit dan E2E
```

## Pemeriksaan Kualitas

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Dokumentasi

- `docs/architecture.md`
- `docs/database.md`
- `docs/security.md`
- `docs/testing.md`
- `docs/demo-scenario.md`

## Demo

- Production URL: `TODO`
- Demo video: `TODO`
- Akun demo: `TODO`, jangan gunakan data pribadi asli

## Tim

- Nama anggota dan peran: `TODO`
- Pembagian kontribusi: `TODO`

## Atribusi

Cantumkan sumber API, dataset, font, ikon, gambar, dan penggunaan AI secara transparan. Pastikan seluruh lisensi mengizinkan penggunaan proyek kompetisi.
