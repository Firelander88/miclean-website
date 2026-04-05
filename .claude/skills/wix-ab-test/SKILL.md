---
name: wix-ab-test
description: A/B test yaradır — CTA, layout, başlıq variantlarını müqayisə edir
user_invocable: true
trigger: /wix-ab-test
---

# /wix-ab-test — A/B Test Skill

## Nə edir
Saytda A/B testlər yaradır: CTA düymə rəngi/mətni, section layout, başlıq variantları. JavaScript ilə traffic bölür, nəticəni izləyir.

## İstifadə
```
/wix-ab-test create "CTA rəngi" --a="gold" --b="green"
/wix-ab-test list                    → Aktiv testləri göstər
/wix-ab-test results "test-id"       → Nəticələri göstər
/wix-ab-test stop "test-id"          → Testi dayandır, qalibi tətbiq et
```

## Test Növləri

### 1. CTA Düymə Testi
```javascript
// A variant: Mövcud gold düymə
// B variant: Yaşıl düymə, fərqli mətn
const variants = {
  A: { bg: '#C9A96E', text: 'Kataloqa bax' },
  B: { bg: '#4CAF50', text: 'Məhsulları kəşf et' }
};
```

### 2. Başlıq Testi
```javascript
const variants = {
  A: { h1: 'Professional Təmizlik Həlləri' },
  B: { h1: '490+ Məhsul, 1 Güvənilir Partner' }
};
```

### 3. Layout Testi
```javascript
const variants = {
  A: { grid: '4 sütun kart' },
  B: { grid: '3 sütun böyük kart' }
};
```

## İmplementasiya
```javascript
// JS embed-ə əlavə olunur
(function() {
  const tests = JSON.parse(localStorage.getItem('ab_tests') || '{}');
  const testId = 'cta-color-v1';

  // Variant təyin et (50/50)
  if (!tests[testId]) {
    tests[testId] = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('ab_tests', JSON.stringify(tests));
  }

  const variant = tests[testId];

  // Variantı tətbiq et
  if (variant === 'B') {
    document.querySelector('.cta-main').style.background = '#4CAF50';
    document.querySelector('.cta-main').textContent = 'Məhsulları kəşf et';
  }

  // Event tracking
  document.querySelector('.cta-main').addEventListener('click', () => {
    track('ab_test_click', { test: testId, variant });
  });
})();
```

## Nəticə Ölçüləri
- Click-through rate (CTR)
- Form submission rate
- Scroll depth
- Time on page
- Bounce rate

## Minimum Test Müddəti
- Trafik az olduğu üçün: minimum 2 həftə
- Minimum nümunə: hər variant üçün 100 ziyarətçi
- Statistik əhəmiyyət: p < 0.05
