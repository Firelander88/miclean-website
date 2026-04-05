---
name: wix-sitemap
description: XML Sitemap və robots.txt generasiya edir, Google Search Console-a submit edir
user_invocable: true
trigger: /wix-sitemap
---

# /wix-sitemap — Sitemap & Robots.txt

## Nə edir
Sayt üçün XML sitemap yaradır, robots.txt konfiqurasiya edir, Google Search Console-a submit prosesini izah edir.

## İstifadə
```
/wix-sitemap generate     → Sitemap yarat
/wix-sitemap robots       → robots.txt yarat
/wix-sitemap submit       → GSC submit təlimatı
/wix-sitemap audit        → Mövcud sitemap yoxla
```

## Wix Konteksti
Wix avtomatik sitemap yaradır: `micleangroup.com/sitemap.xml`
Amma custom embed saytda əlavə SEO meta tag-lar lazımdır.

## Sitemap Strukturu
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.micleangroup.com/</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Kateqoriya səhifələri (əgər varsa) -->
  <!-- Məhsul səhifələri (əgər varsa) -->
</urlset>
```

## SEO Meta Tags (embed-ə əlavə)
```html
<meta name="description" content="MI CLEAN GROUP — Professional təmizlik məhsulları. Otel, restoran, xəstəxana üçün kimyəvi təmizlik vasitələri. Bakı, Azərbaycan.">
<meta name="keywords" content="təmizlik məhsulları, kimyəvi vasitələr, otel təchizatı, HACCP, Bakı">
<link rel="canonical" href="https://www.micleangroup.com/">
<meta property="og:title" content="MI CLEAN GROUP — Professional Təmizlik Həlləri">
<meta property="og:description" content="490+ məhsul, 7 kateqoriya. Otel, restoran, xəstəxana üçün.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.micleangroup.com/">
<meta property="og:locale" content="az_AZ">
```

## Google Search Console
1. Wix Dashboard → Marketing → SEO → sitemap artıq mövcuddur
2. GSC-də verify: HTML tag metodu (Wix SEO settings-dən)
3. Sitemap URL submit: /sitemap.xml
4. Index Coverage yoxla
