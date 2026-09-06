# Architecture Decision Record

## Keputusan

Aplikasi memakai Next.js App Router dengan feature-based Clean Architecture yang pragmatis.

```text
Presentation / Route -> Application -> Domain <- Infrastructure
```

## Batas Layer

- `domain`: entity dan kontrak, tanpa React, Next.js, atau Supabase.
- `application`: use case dan orkestrasi bisnis.
- `infrastructure`: implementasi database atau layanan eksternal.
- `components`: presentasi dan interaksi pengguna.
- `app`: routing, layout, metadata, dan composition root.
- `shared`: kode generik tanpa aturan bisnis khusus fitur.

## Trade-off

Jumlah folder bertambah, tetapi pengujian, penggantian provider, dan pembagian pekerjaan menjadi lebih aman. Jangan membuat layer tambahan untuk fitur yang sangat sederhana.
