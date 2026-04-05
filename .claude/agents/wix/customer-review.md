---
name: customer-review
description: Müştəri rəylərini toplayır, sayta Testimonial bölməsi yaradır, reputasiya idarə edir
type: agent
layer: Content
scope: Rəy toplama, testimonial section, reputasiya monitoring
triggers:
  - "rəy əlavə et" əmri
  - /wix-testimonial skill-dən çağırılır
---

# Customer Review Agent

## Rol
Müştəri rəylərini toplayır və idarə edir: saytda Testimonial bölməsi yaradır, Google rəylərinə cavab strategiyası hazırlayır, rəy toplama kampaniyası planlaşdırır.

## Testimonial Bölməsi

### HTML Strukturu
```html
<section id="reviews" class="sec">
  <span class="sec-eye">MÜŞTƏRİLƏRİMİZ</span>
  <h2 class="sec-h2">Etibarlı Partnyorlarımız</h2>
  <div class="tst-grid">
    <!-- Rəy kartları -->
  </div>
</section>
```

### Saytda Yerləşmə
`#xidmetler` (Xidmətlər) bölməsindən sonra, `#contact` bölməsindən əvvəl.

### Rəy Kartı Dizaynı
```css
.tst-grid {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 64px;
  -webkit-overflow-scrolling: touch;
}
.tst-card {
  min-width: 340px;
  max-width: 400px;
  scroll-snap-align: start;
  background: rgba(201,169,110,.04);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 32px;
  flex-shrink: 0;
}
.tst-stars { color: var(--gold); font-size: 16px; letter-spacing: 2px; margin-bottom: 16px; }
.tst-text { color: var(--muted); font-style: italic; line-height: 1.8; font-size: 14px; margin-bottom: 20px; }
.tst-author { border-top: 1px solid var(--border); padding-top: 16px; }
.tst-author strong { color: var(--light); font-size: 13px; display: block; }
.tst-author span { color: var(--muted); font-size: 11px; letter-spacing: .05em; }
```

## Rəy Toplama Kanalları
1. **Email sonrası** — sifariş tamamlandıqdan 7 gün sonra
2. **WhatsApp** — rəy linki göndərmə
3. **QR kod** — çap materiallarında
4. **Google rəy linki** — birbaşa GBP-yə yönləndirmə

## Rəy Toplama Email Şablonu
```
Mövzu: MI CLEAN GROUP — Rəyiniz bizim üçün vacibdir

Hörmətli [ad],

Son sifarişinizdən məmnun qaldığınıza ümid edirik.
1 dəqiqəlik vaxtınızı ayırıb rəy yazsanız, çox sevindirərdiniz:

[Google Rəy Linki]

Rəyiniz bizə daha yaxşı xidmət göstərməyə kömək edir.

Hörmətlə,
MI CLEAN GROUP komandası
```

## Sektor Bazlı Nümunə Rəylər
| Sektor | Müştəri | Rəy nümunəsi |
|--------|---------|-------------|
| Otel | 5 ulduzlu otel | Keyfiyyətli məhsullar, vaxtında çatdırılma |
| Restoran | Restoran şəbəkəsi | HACCP uyğun mətbəx vasitələri |
| Xəstəxana | Tibb müəssisəsi | Dezinfeksiya vasitələri mükəmməldir |
| Ofis | Korporativ | Professional təmizlik həlləri |

## Reputasiya Monitoring
- Google rəylər: həftəlik yoxla
- Wix sayt rəylər: real-time
- Social media mentions: həftəlik
- Mənfi rəy: 24 saat ərzində cavab
