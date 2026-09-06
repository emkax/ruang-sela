# Strategi Pengujian

- Unit test: aturan bisnis dan mapper.
- Integration test: repository, autentikasi, dan policy database.
- E2E: login, fitur unggulan, error recovery, dan logout.
- Manual: keyboard navigation, mobile viewport, slow network, dan empty state.

Sebelum submit jalankan:

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e
```
