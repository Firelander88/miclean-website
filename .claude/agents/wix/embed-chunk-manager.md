---
name: embed-chunk-manager
description: index.html-i Wix embed limiti (15K) üçün ağıllı şəkildə chunk-lara bölür
type: agent
layer: Structure
scope: Content parsing, smart splitting, dependency tracking
triggers:
  - Embed Sync Agent tərəfindən çağırılır
  - "chunk böl" əmri
---

# Embed Chunk Manager Agent

## Rol
`public/index.html` faylının CSS, HTML və JS bölmələrini Wix-in 15,000 simvol limitinə uyğun ağıllı şəkildə bölür. Tag-ların ortasından, selector-ların yarımçıq qalmasından qaçır.

## Fayl Strukturu
```
index.html (~132KB)
├── <style> ... </style>     → CSS bölməsi (~36KB → 3 chunk)
├── HTML content              → HTML bölməsi (~59KB → 6 chunk)
└── <script> ... </script>   → JS bölməsi (~32KB → 3 chunk)
```

## Bölmə Qaydaları

### CSS Splitting Rules
```
Prioritet sırası:
1. @media query boundary — media block-u HEÇVAXT bölmə
2. Böyük comment boundary — /* ===== SECTION ===== */
3. Rule set boundary — } simvolundan sonra
4. Selector group boundary — , simvolundan sonra (yalnız çarəsiz halda)

QADAĞANLAR:
- @media { ... } blok-un ortasından bölmə
- @keyframes { ... } blok-un ortasından bölmə
- Property: value; arasından bölmə
- String literal-in ortasından bölmə (url('...'))

İLK CHUNK-a yığ:
- :root { --var definitions }
- @import statements
- @font-face declarations
- * / body / html base styles
```

### HTML Splitting Rules
```
Prioritet sırası:
1. <section> boundary — section tag-ları arası
2. Böyük <!-- comment --> boundary
3. <div class="major"> boundary (əsas container-lər)
4. <article> / <aside> boundary

QADAĞANLAR:
- Açıq tag-ı bağlanmamış saxlama (<div> ... | ... </div>)
- Attribute-un ortasından bölmə
- <table> / <ul> / <form> ortasından bölmə
- inline <style> və ya <script> ortasından bölmə

TAG BALANCE YOXLA:
- Hər chunk-da açıq tag sayı = bağlı tag sayı olmalıdır
- Əgər balance pozulursa → wrapper div əlavə et:
  Chunk N sonu: </div><!-- chunk-wrap -->
  Chunk N+1 başı: <div><!-- chunk-wrap -->
```

### JS Splitting Rules
```
Prioritet sırası:
1. IIFE boundary — })(); sonrası
2. Function declaration boundary — function name() { ... } sonrası
3. Event listener boundary — addEventListener callback sonrası
4. Statement boundary — ; sonrası (top-level)

QADAĞANLAR:
- Function body-nin ortasından bölmə
- Object literal-in ortasından bölmə { key: value }
- Template literal-in ortasından bölmə `...`
- String-in ortasından bölmə '...' / "..."
- if/else/switch blok-unun ortasından bölmə

VARIABLE SCOPE:
- Chunk 1-də olan global variable-lar sonrakı chunk-larda mövcuddur
- let/const block-scoped — eyni chunk-da olmalıdır
- Shared state → window.X = ... formatında global yap
```

## Chunk Ölçü Strategiyası
```
Target: 13,000 simvol (2K buffer saxla)
Minimum: 3,000 simvol (çox kiçik chunk yaratma)
Maximum: 14,800 simvol (200 simvol safety margin)

Əgər bölmə 14,800-dən kiçikdirsə → bölmə, 1 chunk saxla
Əgər 14,800-30,000 → 2 chunk
Əgər 30,000-45,000 → 3 chunk
...
```

## Output Format
```json
{
  "type": "css|html|js",
  "chunks": [
    {
      "index": 0,
      "content": "...",
      "size": 12450,
      "embedId": "existing-id-or-null",
      "placement": "HEAD|BODY_END",
      "startLine": 47,
      "endLine": 180,
      "tags_open": [],
      "tags_close": []
    }
  ],
  "totalSize": 36000,
  "chunkCount": 3
}
```

## Dependency Map
```
CSS Chunk 1 → :root vars (bütün CSS chunk-lar bundan asılıdır)
CSS Chunk 2 → Component styles (HTML-dən əvvəl yüklənməli)
CSS Chunk 3 → Print + utility styles

HTML Chunk 1 → nav, cover (CSS 1-2 lazım)
HTML Chunk 2 → overview grid (CSS 2 lazım)
HTML Chunk 3-5 → product sections (CSS 2 + Data embeds lazım)
HTML Chunk 6 → contact, footer (CSS 2-3 lazım)

JS Chunk 1 → DOM ready, nav scroll (HTML chunk-lar lazım)
JS Chunk 2 → Search, filter (Data embeds + HTML lazım)
JS Chunk 3 → Modals, print, animations (Hamısı lazım)
```

## Load Order (Wix Embed sırası)
```
1. CSS Chunk 1-3 (HEAD) — həmişə birinci
2. Wix Hide (HEAD) — template gizlətmə
3. Data 1-4 (BODY_END) — məhsul datası
4. HTML Chunk 1-6 (BODY_END) — content
5. JS Chunk 1-3 (BODY_END) — funksionallıq
```

## Validasiya
Hər chunk yaradıldıqdan sonra:
- [ ] Ölçü <= 14,800 simvol
- [ ] CSS: Bütün `{` sayı = `}` sayı
- [ ] HTML: Tag balance düz
- [ ] JS: Bütün `(` sayı = `)` sayı, `{` = `}`
- [ ] Encoding: UTF-8, Azərbaycan hərfləri (ə, ş, ğ, ı, ö, ü, ç) düzgün
