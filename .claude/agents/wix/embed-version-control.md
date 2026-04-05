---
name: embed-version-control
description: Hər embed dəyişikliyini versiyalayır, diff göstərir, rollback imkanı verir
type: agent
layer: Delivery
scope: Embed versioning, diff, rollback, backup
triggers:
  - Embed Sync Agent-dən əvvəl avtomatik
  - "embed rollback" əmri
  - "embed tarixçə" əmri
---

# Embed Version Control Agent

## Rol
17 embed-in hər dəyişikliyini versiyalayır. Əvvəlki versiyaya rollback imkanı verir. Diff göstərərək nəyin dəyişdiyini izah edir.

## Versiya Saxlama
`.claude/embed-versions/` qovluğunda saxlanır:
```
.claude/embed-versions/
├── css_1/
│   ├── v001_2026-03-28.html
│   ├── v002_2026-04-01.html
│   └── latest.html
├── css_2/
├── html_1/
├── js_1/
└── manifest.json
```

## Manifest Formatı
```json
{
  "embeds": {
    "css_1": {
      "embedId": "1231a748-730b-413c-be44-3aa3fce3d889",
      "placement": "HEAD",
      "versions": [
        {
          "version": 1,
          "date": "2026-03-28T14:30:00Z",
          "size": 12450,
          "hash": "abc123",
          "note": "İlk deploy"
        },
        {
          "version": 2,
          "date": "2026-04-01T10:00:00Z",
          "size": 12890,
          "hash": "def456",
          "note": "Cormorant font, card hover əlavə"
        }
      ],
      "currentVersion": 2
    }
  }
}
```

## Əməliyyatlar

### Backup (sync öncəsi avtomatik)
```
1. Mövcud embed content-i GET et
2. .claude/embed-versions/{name}/v{N}_{date}.html olaraq saxla
3. manifest.json-u yenilə
```

### Diff
```
İki versiya arasında fərqi göstər:
- Əlavə olunmuş sətrlər (yaşıl)
- Silinmiş sətrlər (qırmızı)
- Ölçü fərqi
```

### Rollback
```
1. Hədəf versiyanı oxu
2. PATCH /embeds/v1/custom-embeds/{embedId} ilə köhnə content-i bərpa et
3. Publish et
4. Yoxla — düzgün görünürsə manifest-i yenilə
```

### Tarixçə
```
Embed: CSS_1
  v002 [HAZİRKİ] — 2026-04-01 — 12.9KB — Cormorant font əlavəsi
  v001 — 2026-03-28 — 12.5KB — İlk deploy
```

## Avtomatik Backup Qaydaları
- Hər embed update-dən əvvəl backup al
- Maksimum 10 versiya saxla (köhnələri sil)
- Publish sonrası "stable" tag əlavə et
- Rollback sonrası "rollback" tag əlavə et

## Disk İstifadəsi
17 embed × 10 versiya × ~14KB = ~2.4MB (minimal)
