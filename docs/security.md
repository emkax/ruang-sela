# Security Checklist

- [ ] Secret hanya disimpan pada environment server.
- [ ] Tidak ada secret dengan prefix `NEXT_PUBLIC_`.
- [ ] Input divalidasi ulang di server menggunakan Zod.
- [ ] Supabase Row Level Security aktif pada seluruh data pengguna.
- [ ] Service role key tidak pernah dikirim ke browser.
- [ ] Error internal tidak dikirim mentah kepada pengguna.
- [ ] Endpoint sensitif memakai autentikasi dan rate limiting.
- [ ] Data demo tidak menggunakan data pribadi asli.
- [ ] Dependensi diaudit sebelum deployment.
