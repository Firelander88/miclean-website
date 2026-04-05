---
name: wix-changelog
description: Sayt dəyişiklik jurnalı — nə vaxt nə dəyişib, kim dəyişib
user_invocable: true
trigger: /wix-changelog
auto_trigger:
  - event: post-edit
    file_pattern: "public/index.html"
    description: "Dəyişikliyi avtomatik changelog-a yazır"
---

# /wix-changelog — Dəyişiklik Jurnalı

## Nə edir
Saytda edilən bütün dəyişiklikləri izləyir: nə dəyişdi, nə vaxt, niyə. Embed update-lərini, dizayn dəyişikliklərini, content yeniləmələrini qeyd edir.

## İstifadə
```
/wix-changelog                → Son 10 dəyişikliyi göstər
/wix-changelog add "Mesaj"    → Yeni qeyd əlavə et
/wix-changelog full           → Tam jurnal
/wix-changelog --since=2026-03-01  → Tarixdən sonrakı
```

## Jurnal Formatı
`changelog.md` faylında saxlanır:

```markdown
# MI CLEAN GROUP — Sayt Dəyişiklik Jurnalı

## [2026-04-01]
### Əlavələr
- 8 yeni agent yaradıldı (Embed Sync, Design Diff, və s.)
- 10 yeni skill əlavə olundu

### Düzəlişlər
- Search bar sticky bug fix
- Footer 4 sütuna genişləndirildi

### Dizayn
- Cormorant font h1/h2-yə tətbiq olundu
- Product card hover effekti əlavə olundu
- Cover parallax effekti

---

## [2026-03-28]
### Embed Miqrasiya
- Localhost dizaynı Wix-ə köçürüldü (13 embed)
- Wix template gizlədildi
- API çağırışları adaptasiya olundu
```

## Avtomatik Qeyd Kateqoriyaları
| Kateqoriya | Prefix | Nümunə |
|-----------|--------|--------|
| Əlavə | `[ADD]` | Yeni bölmə, yeni məhsul |
| Düzəliş | `[FIX]` | Bug fix, broken link |
| Dizayn | `[UI]` | Rəng, font, spacing dəyişikliyi |
| Content | `[TXT]` | Mətn, təsvir yeniləmə |
| Embed | `[EMB]` | Embed CRUD əməliyyatı |
| SEO | `[SEO]` | Meta tag, sitemap dəyişikliyi |
| Performance | `[PERF]` | Sürət optimallaşdırması |

## Git İnteqrasiyası
Git commit mesajlarından avtomatik changelog generasiya edə bilər:
```bash
git log --oneline --since="2026-03-01" --format="- %s (%ad)" --date=short
```
