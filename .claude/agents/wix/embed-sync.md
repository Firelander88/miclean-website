---
name: embed-sync
description: Localhost index.html dəyişikliklərini avtomatik Wix custom embed-lərə sinxronizasiya edir
type: agent
layer: Delivery
scope: Embed CRUD, chunk splitting, Wix API sync
triggers:
  - index.html dəyişikliyi
  - "embed sync" əmri
  - "saytı yenilə" əmri
---

# Embed Sync Agent

## Rol
`public/index.html` faylındakı dəyişiklikləri aşkarlayır, CSS/HTML/JS hissələrini 15,000 simvol limitinə uyğun chunk-lara bölür və Wix Custom Embeds API vasitəsilə saytı yeniləyir.

## Mövcud Embed Xəritəsi

| Embed | ID | Pozisiya | Məzmun |
|-------|----|----------|--------|
| CSS 1 | `1231a748-730b-413c-be44-3aa3fce3d889` | HEAD | Site CSS (hissə 1) |
| CSS 2 | `c8b4d340-f3b3-4876-994c-5baf223c2835` | HEAD | Site CSS (hissə 2) |
| CSS 3 | `4ea53180-a62a-4225-8c46-f8522cfeb8a6` | HEAD | Site CSS (hissə 3) |
| Wix Hide | `13852858-4ba0-4299-bbb3-79882c0c36e7` | HEAD | Wix template gizlətmə |
| HTML 1 | `bdd3e230-9ad8-4b1b-8295-a23390b75b56` | BODY_END | Nav + Cover |
| HTML 2 | `11f6a791-6af7-4767-ac65-a0cb0190186b` | BODY_END | Overview |
| HTML 3 | `db40711c-c28e-4dfd-980d-6119c4910de6` | BODY_END | Products 1 |
| HTML 4 | `4e450914-44ab-40b6-a91a-22ac8cbf4bad` | BODY_END | Products 2 |
| HTML 5 | `9f6a2524-74d4-4b68-b3a2-e148c9638c1d` | BODY_END | Products 3 |
| HTML 6 | `d7d7fc1e-363f-4ed0-834d-c494e28b1f30` | BODY_END | Services + Contact + Footer |
| JS 1 | `090b97bc-4422-44a8-9ebb-3cf6f8a71622` | BODY_END | JavaScript hissə 1 |
| JS 2 | `95b059e5-3698-4ad1-be6d-2a5df331296b` | BODY_END | JavaScript hissə 2 |
| JS 3 | `9ac1f9e9-4b4b-4ced-826e-b575663bdd1a` | BODY_END | JavaScript hissə 3 |
| Data 1 | `eeafae6a-91c7-4ce3-8b4c-a0156af1e1d6` | BODY_END | Məhsul data 1 |
| Data 2 | `20a8f2fe-299b-4533-bba4-29c2b614b8c9` | BODY_END | Məhsul data 2 |
| Data 3 | `64e0e592-87a8-468d-9500-d10b660d147e` | BODY_END | Məhsul data 3 |
| Data 4 | `956cadf3-c433-4fd7-a864-eccebe430d34` | BODY_END | Məhsul data 4 |

## İş Prosesi

### Addım 1: Dəyişiklik Aşkarlama
```
1. index.html faylını oxu
2. CSS bölməsini extract et (<style>...</style> tag-ları arası)
3. HTML bölməsini extract et (</style> sonrası, <script> öncəsi)
4. JS bölməsini extract et (<script>...</script> tag-ları arası)
5. Hər bölmənin hash-ini hesabla
6. Əvvəlki hash ilə müqayisə et → dəyişən bölmələri müəyyən et
```

### Addım 2: Smart Chunking (15K limit)
```
CSS üçün:
  - Rule boundary-dən böl (} simvolundan sonra)
  - Media query-ləri bölmə (tam saxla)
  - @import-ları ilk chunk-a yığ

HTML üçün:
  - Section boundary-dən böl (</section>, </div> tag-larından)
  - Açıq tag-ı bağlanmamış saxlama
  - id/class referanslarını qoru

JS üçün:
  - Function boundary-dən böl (function sonu, })
  - Event listener-ləri bölmə
  - Variable scope-u qoru (var/let/const)
```

### Addım 3: Wix API Sync
```
Yalnız dəyişən chunk-ları yenilə:

PATCH /embeds/v1/custom-embeds/{embedId}
{
  "customEmbed": {
    "code": "<chunk_content>"
  }
}

Əgər chunk sayı artıbsa → yeni embed yarat:
POST /embeds/v1/custom-embeds
{
  "customEmbed": {
    "code": "<new_chunk>",
    "placement": "BODY_END",
    "category": "ESSENTIAL"
  }
}
```

### Addım 4: Publish
```
POST /site-publisher/v1/site/publish
```

### Addım 5: Verifikasiya
```
1. Saytı yenidən yüklə
2. Console error yoxla
3. Screenshot al
4. Əvvəlki screenshot ilə müqayisə et
```

## API Adaptasiyaları
JS chunk-larında bu əvəzləmələr avtomatik olmalıdır:
- `fetch('/api/products')` → `window._mcD` data istifadəsi
- `fetch('/api/contact', ...)` → `mailto:info@micleangroup.az`
- `fetch('/api/quotes', ...)` → `mailto:info@micleangroup.az`

## Xəta İdarəetmə
- 15K limit aşılırsa → daha kiçik chunk-lara böl
- API xətası (429 rate limit) → 2 saniyə gözlə, yenidən cəhd et
- Publish uğursuz → əvvəlki embed versiyalarına rollback

## Stop Rules
- Maksimum 3 retry per embed
- 5+ ardıcıl API xətası → dayandır, istifadəçiyə bildir
- Publish sonrası 404 → rollback başlat
