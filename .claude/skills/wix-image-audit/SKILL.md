---
name: wix-image-audit
description: Şəkilsiz məhsulları tapır, şəkil əhatə hesabatı verir, optimize edir
user_invocable: true
trigger: /wix-image-audit
---

# /wix-image-audit — Şəkil Audit Skill

## Nə edir
273 məhsulun şəkil vəziyyətini yoxlayır: şəkilsiz kartları tapır, broken URL-ləri aşkarlayır, optimize təklifləri verir.

## İstifadə
```
/wix-image-audit              → Tam audit
/wix-image-audit kimyəvi      → Tək kateqoriya
/wix-image-audit --fix         → Placeholder əlavə et
```

## İcra Addımları

### 1. Skan
```
index.html-dən bütün .pc kartlarını tap
Hər kart üçün:
  - <img> tag var mı?
  - src URL işləyir mı?
  - alt text var mı?
  - loading="lazy" var mı?
  - width/height təyin olunub mı?
```

### 2. Hesabat
```markdown
## Şəkil Audit — [tarix]

| Kateqoriya | Cəmi | Şəkilli | Şəkilsiz | Əhatə |
|-----------|------|---------|-----------|-------|
| Kimyəvi   | 45   | 2       | 43        | 4%    |
| Camaşırxana| 38  | 5       | 33        | 13%   |
| ...       |      |         |           |       |
| **CƏMI**  | 273  | 9       | 264       | 3%    |

### Broken URL-lər
- [məhsul kodu]: [URL] → 404

### Alt Text Yoxdur
- [məhsul kodu]: img var amma alt yoxdur
```

### 3. Auto-Fix (--fix flag ilə)
Şəkilsiz kartlara kateqoriya bazlı CSS placeholder əlavə edir:
```css
.pc-thumb[data-empty] {
  background: linear-gradient(135deg, var(--bg2), var(--bg));
  display: flex;
  align-items: center;
  justify-content: center;
}
.pc-thumb[data-empty]::after {
  content: '📦';
  font-size: 2em;
  opacity: 0.2;
}
```

### 4. Wix Media Sync (optional)
Wix Media Manager-dəki şəkilləri yoxla, uyğun olanları HTML-ə əlavə et.

## Performance Yoxlama
- Hər şəkil < 100KB
- Format: WebP tercih olunur
- İlk 8 kart: loading="eager"
- Qalanları: loading="lazy"
- Aspect ratio: 4:3 (400x300)
