---
name: wix-a11y
description: >
  Accessibility (a11y) auditor for MI CLEAN GROUP Wix site. Checks WCAG 2.1 compliance
  including contrast ratios, alt text, keyboard navigation, ARIA labels, and semantic HTML.
  Triggers on: "accessibility", "a11y", "əlçatanlıq", "WCAG", "kontrast", "alt text yoxla",
  "keyboard navigation", "screen reader", "əlil istifadəçi", "inclusive design".
---

# Accessibility (WCAG 2.1) Auditor

Audit the MI CLEAN GROUP Wix site for accessibility compliance.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Site URL**: `www.micleangroup.com`

## Audit Checklist

### 1. Color Contrast (WCAG 2.1 AA)
Check brand colors meet minimum contrast ratios:
- Normal text: 4.5:1 ratio
- Large text (18px+): 3:1 ratio
- Brand colors to verify:
  - `#0a2351` (navy) on `#ffffff` → ~15.6:1 ✅
  - `#1a73e8` (blue) on `#ffffff` → ~4.6:1 ✅
  - `#5f6368` (gray) on `#ffffff` → ~5.9:1 ✅
  - `#5f6368` (gray) on `#f5f7fa` → ~5.4:1 ✅

### 2. Image Alt Text
- Check Custom Embeds for images without alt attributes
- CMS products should have descriptive alt text
- Decorative images should have `alt=""`

### 3. Keyboard Navigation
Using Claude Preview tools:
- Tab through all interactive elements
- Verify focus indicators are visible
- Check modal can be closed with Escape
- Ensure no keyboard traps

### 4. Semantic HTML
Check Custom Embeds for:
- Proper heading hierarchy (h1 → h2 → h3)
- Button elements for interactive controls (not just divs)
- Form labels on inputs
- ARIA landmarks where appropriate

### 5. Screen Reader Compatibility
- Meaningful link text (not "click here")
- ARIA labels on icon-only buttons
- Live regions for dynamic content updates
- Proper reading order

### 6. Touch Targets (Mobile)
- Minimum 44x44px touch targets
- Adequate spacing between interactive elements
- No hover-only interactions

## Auto-Fix Actions

When issues found in Custom Embeds:
1. Add `alt` attributes to images
2. Add `aria-label` to buttons
3. Ensure focus styles are visible
4. Add `role` attributes where needed
5. Update embed via PATCH API

## Report Format

```
## ♿ Əlçatanlıq Audit Hesabatı

**Standart**: WCAG 2.1 Level AA
**Tarix**: {date}

### Ümumi Bal: {score}/100

| Kateqoriya | Bal | Status |
|-----------|-----|--------|
| Rəng Kontrastı | {x}/20 | ✅/❌ |
| Alt Text | {x}/20 | ✅/❌ |
| Klaviatura Nav. | {x}/20 | ✅/❌ |
| Semantik HTML | {x}/20 | ✅/❌ |
| Mobil Toxunma | {x}/20 | ✅/❌ |

### Tapılan Problemlər
{list}

### Düzəlişlər
{list of fixes applied}
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Full accessibility audit |
| `contrast` | Only color contrast check |
| `fix` | Audit + auto-fix embed issues |
| `report` | Generate detailed WCAG report |
