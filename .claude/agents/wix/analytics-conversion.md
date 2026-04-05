---
name: analytics-conversion
description: Google Analytics, conversion tracking və heatmap inteqrasiyası qurur
type: agent
layer: Quality
scope: Analytics setup, event tracking, conversion funnel, reporting
triggers:
  - "analytics qur" əmri
  - "tracking əlavə et" əmri
  - Launch Readiness Agent-dən əvvəl
---

# Analytics & Conversion Agent

## Rol
Saytda istifadəçi davranışını izləmək üçün analytics infrastrukturu qurur: Google Analytics 4, CTA click tracking, form submission tracking, scroll depth tracking.

## Analytics Stack

### 1. Google Analytics 4 (GA4)
```html
<!-- HEAD embed-ə əlavə olunacaq -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: 'MI CLEAN GROUP - Professional Cleaning Solutions',
    page_location: window.location.href,
    language: 'az',
    content_group: 'catalog'
  });
</script>
```

**Lazım**: İstifadəçidən GA4 Measurement ID (G-XXXXXXXXXX) alınmalı.

### 2. Wix Analytics (Daxili)
Wix-in öz analytics sistemi avtomatik işləyir. Əlavə setup lazım deyil.
Dashboard: Wix Admin → Analytics & Reports

## Event Tracking Plan

### Navigation Events
| Event | Trigger | Parametrlər |
|-------|---------|-------------|
| `nav_click` | Nav menyu item click | `menu_item`, `section` |
| `cta_click` | CTA düymə click | `cta_type` (header/float/inline) |
| `logo_click` | Logo click | — |

### Product Events
| Event | Trigger | Parametrlər |
|-------|---------|-------------|
| `product_view` | Kart viewport-a daxil olur | `product_code`, `category` |
| `product_detail` | Kart modal açılır | `product_code`, `product_name` |
| `product_compare` | Müqayisəyə əlavə | `product_code` |
| `product_quote_add` | Sorğuya əlavə | `product_code`, `product_name` |

### Search Events
| Event | Trigger | Parametrlər |
|-------|---------|-------------|
| `search` | Axtarış submit | `search_term`, `results_count` |
| `filter_click` | Kateqoriya filter | `category` |

### Form Events
| Event | Trigger | Parametrlər |
|-------|---------|-------------|
| `form_start` | İlk input focus | `form_type` (contact/quote) |
| `form_submit` | Form submit | `form_type`, `success` |
| `form_error` | Validasiya xətası | `form_type`, `error_field` |

### Engagement Events
| Event | Trigger | Parametrlər |
|-------|---------|-------------|
| `scroll_depth` | 25%, 50%, 75%, 100% | `percent` |
| `whatsapp_click` | WhatsApp button click | `source` (float/footer/contact) |
| `phone_click` | Telefon link click | — |
| `print_catalog` | Print/PDF button click | `items_count` |

## Implementation (JS Embed-ə əlavə)
```javascript
// Unified tracking function
function track(event, params = {}) {
  // GA4
  if (typeof gtag === 'function') {
    gtag('event', event, params);
  }
  // Console log (development)
  if (location.hostname === 'localhost') {
    console.log('[Track]', event, params);
  }
}

// Scroll Depth Tracking
(function() {
  const thresholds = [25, 50, 75, 100];
  const fired = new Set();
  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    thresholds.forEach(t => {
      if (scrollPercent >= t && !fired.has(t)) {
        fired.add(t);
        track('scroll_depth', { percent: t });
      }
    });
  }, { passive: true });
})();

// CTA Click Tracking
document.querySelectorAll('[data-track]').forEach(el => {
  el.addEventListener('click', function() {
    track(this.dataset.track, JSON.parse(this.dataset.trackParams || '{}'));
  });
});

// Product Card View Tracking (IntersectionObserver)
const productObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      track('product_view', {
        product_code: card.querySelector('.pc-code')?.textContent,
        category: card.closest('.sec')?.id
      });
      productObserver.unobserve(card);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.pc').forEach(card => productObserver.observe(card));
```

## Conversion Funnel
```
Visitor → Catalog View → Product View → Quote Add → Quote Submit → Contact
  100%      85%            40%            8%          3%           2%

Optimizasiya nöqtələri:
1. Catalog → Product: Card dizaynı, CTA visibility
2. Product → Quote: "Əlavə et" button UX
3. Quote → Submit: Form simplicity, WhatsApp alternative
```

## KPI Dashboard
```
Həftəlik izlənəcəklər:
- Unikal ziyarətçi sayı
- Orta sessiya müddəti
- Bounce rate (hədəf: < 40%)
- Ən çox baxılan kateqoriyalar
- Ən çox baxılan məhsullar (Top 20)
- Form submission sayı
- WhatsApp click sayı
- Axtarış sorğuları (ən populyar)
- Device breakdown (mobile vs desktop)
- Scroll depth distribution
```

## GDPR / Cookie Uyğunluq
```javascript
// Cookie consent (Wix-in öz sistemi ilə)
// Custom embed-lərdə GA4 yalnız razılıq sonrası yüklənməli:
if (document.cookie.includes('analytics_consent=true')) {
  // GA4 script-i yüklə
}
```

## Gözləyən Hərəkət
- [ ] GA4 Measurement ID almaq (istifadəçidən)
- [ ] Tracking JS-i embed-ə əlavə etmək
- [ ] `data-track` attribute-larını HTML-ə əlavə etmək
- [ ] İlk həftə data toplayıb hesabat hazırlamaq
