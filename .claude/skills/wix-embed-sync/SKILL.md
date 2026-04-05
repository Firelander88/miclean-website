---
name: wix-embed-sync
description: index.html dəyişikliklərini Wix custom embed-lərə avtomatik sinxronizasiya edir
user_invocable: true
trigger: /wix-embed-sync
auto_trigger:
  - event: post-edit
    file_pattern: "public/index.html"
    description: "index.html dəyişdikdə avtomatik embed sync təklif et"
---

# /wix-embed-sync — Embed Sinxronizasiya Skill

## Nə edir
`public/index.html` faylındakı CSS, HTML və JS dəyişikliklərini Wix saytdakı 13 custom embed-ə sinxronizasiya edir.

## Avtomatik Trigger
Bu skill `public/index.html` faylı redaktə olunduqda avtomatik aktivləşir.

## İcra Addımları

### 1. Extract — index.html-dən bölmələri çıxar
```
CSS: <style> tag-ları arasındakı content
HTML: </style> sonrası, <script> öncəsi content
JS: <script> tag-ları arasındakı content
```

### 2. Chunk — 15K limitə uyğun böl
```
Hər bölmə üçün:
- Ölçü <= 14,800 → 1 chunk, bölmə yoxdur
- Ölçü > 14,800 → uyğun boundary-dən böl:
  CSS: } rule boundary
  HTML: </section> və ya </div> boundary
  JS: function/IIFE boundary
- Tag/bracket balance yoxla
```

### 3. Diff — Yalnız dəyişən chunk-ları müəyyən et
```
Hər chunk-ın hash-ini hesabla
Əvvəlki versiya ilə müqayisə et
Yalnız fərqli olanları update siyahısına əlavə et
```

### 4. Update — Wix API ilə yenilə
```
Dəyişən hər chunk üçün:
CallWixSiteAPI → PATCH /embeds/v1/custom-embeds/{embedId}
Body: { "customEmbed": { "code": "<new_content>" } }
```

### 5. Publish
```
CallWixSiteAPI → POST /site-publisher/v1/site/publish
```

### 6. Verify
```
Saytı yenidən yüklə
Console error yoxla
Screenshot al — istifadəçiyə göstər
```

## Embed ID Xəritəsi
```
CSS_1:  1231a748-730b-413c-be44-3aa3fce3d889 (HEAD)
CSS_2:  c8b4d340-f3b3-4876-994c-5baf223c2835 (HEAD)
CSS_3:  4ea53180-a62a-4225-8c46-f8522cfeb8a6 (HEAD)
HIDE:   13852858-4ba0-4299-bbb3-79882c0c36e7 (HEAD)
HTML_1: bdd3e230-9ad8-4b1b-8295-a23390b75b56 (BODY_END)
HTML_2: 11f6a791-6af7-4767-ac65-a0cb0190186b (BODY_END)
HTML_3: db40711c-c28e-4dfd-980d-6119c4910de6 (BODY_END)
HTML_4: 4e450914-44ab-40b6-a91a-22ac8cbf4bad (BODY_END)
HTML_5: 9f6a2524-74d4-4b68-b3a2-e148c9638c1d (BODY_END)
HTML_6: d7d7fc1e-363f-4ed0-834d-c494e28b1f30 (BODY_END)
JS_1:   090b97bc-4422-44a8-9ebb-3cf6f8a71622 (BODY_END)
JS_2:   95b059e5-3698-4ad1-be6d-2a5df331296b (BODY_END)
JS_3:   9ac1f9e9-4b4b-4ced-826e-b575663bdd1a (BODY_END)
```

## JS Adaptasiya Qaydaları
Sync zamanı JS chunk-larında bu əvəzləmələri avtomatik et:
- `fetch('/api/products')` → `Promise.resolve(window._mcD || [])`
- `fetch('/api/contact'` → `mailto:info@micleangroup.az` redirect
- `fetch('/api/quotes'` → `mailto:info@micleangroup.az` redirect

## Xəta Halları
- Chunk > 15K → daha kiçik böl, yenidən cəhd et
- API 429 → 3 saniyə gözlə, retry
- API 401 → "Wix auth problemi" xəbərdarlığı
- Publish fail → embed dəyişiklikləri artıq tətbiq olunub, manual publish lazım
