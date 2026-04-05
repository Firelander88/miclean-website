---
name: wix-testimonial
description: Müştəri rəyləri toplama, formatlaşdırma və sayta əlavə etmə
user_invocable: true
trigger: /wix-testimonial
---

# /wix-testimonial — Müştəri Rəyləri

## Nə edir
Müştəri rəylərini toplayır, formatlaşdırır və saytda "Müştərilərimiz" bölməsi yaradır.

## İstifadə
```
/wix-testimonial add "Rəy mətni" --author="Şirkət adı" --role="Menecer"
/wix-testimonial generate       → Nümunə rəy strukturu yarat
/wix-testimonial section        → Sayta rəy bölməsi əlavə et
```

## Rəy Kartı HTML
```html
<div class="tst-card">
  <div class="tst-stars">★★★★★</div>
  <p class="tst-text">"[Rəy mətni — max 150 söz]"</p>
  <div class="tst-author">
    <strong>[Ad Soyad]</strong>
    <span>[Vəzifə], [Şirkət]</span>
  </div>
</div>
```

## Rəy Kateqoriyaları
| Sektor | Nümunə müştəri |
|--------|---------------|
| Otel | Hilton, Marriott, Fairmont |
| Restoran | Zəfəran, Dolma |
| Xəstəxana | MedLife, Baku Medical |
| Ofis | SOCAR, BP, Azərenerji |
| Ev | Fərdi müştərilər |

## Sayt İnteqrasiyası
Rəy bölməsi `#xidmetler` və `#contact` arasına əlavə olunur.
Slider/carousel formatında 3-6 rəy göstərilir.
Auto-rotate: 5 saniyədə 1 rəy.

## CSS Stili
```css
.tst-section { padding: 80px 64px; background: var(--bg); }
.tst-grid { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; }
.tst-card { min-width: 320px; scroll-snap-align: start; background: var(--bg2); border: 1px solid var(--border); border-radius: 4px; padding: 32px; }
.tst-stars { color: var(--gold); font-size: 18px; margin-bottom: 16px; }
.tst-text { color: var(--muted); font-style: italic; line-height: 1.7; margin-bottom: 16px; }
.tst-author strong { color: var(--light); display: block; }
.tst-author span { color: var(--muted); font-size: 12px; }
```
