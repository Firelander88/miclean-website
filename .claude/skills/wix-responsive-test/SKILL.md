---
name: wix-responsive-test
description: Saytı 5 fərqli ekran ölçüsündə test edir, responsive problemləri aşkarlayır
user_invocable: true
trigger: /wix-responsive-test
auto_trigger:
  - event: post-edit
    file_pattern: "public/index.html"
    condition: "CSS @media dəyişikliyi olduqda"
---

# /wix-responsive-test — Responsive Test Skill

## Nə edir
micleangroup.com saytını 5 ekran ölçüsündə test edir, screenshot alır, problemləri tapır.

## Test Ölçüləri
1. **Mobile S** — 375x667 (iPhone SE)
2. **Mobile L** — 393x852 (iPhone 14)
3. **Tablet** — 768x1024 (iPad)
4. **Laptop** — 1024x768
5. **Desktop** — 1440x900

## İcra Addımları

### 1. Saytı aç
```
preview_start və ya Chrome-da micleangroup.com aç
```

### 2. Hər ölçü üçün:
```
a) Ekranı resize et → [width]x[height]
b) Full page screenshot al
c) Horizontal overflow yoxla:
   - document.documentElement.scrollWidth > window.innerWidth ?
d) Touch target yoxla (mobile üçün):
   - Bütün clickable elementlər >= 44x44px
e) Font readability:
   - body font-size >= 14px
   - h1 >= 24px (mobile), >= 40px (desktop)
f) Grid layout yoxla:
   - Products: 4col(desktop) → 2col(tablet) → 1col(mobile)
   - Footer: 4col → 2col → 1col
```

### 3. Hesabat
```markdown
## Responsive Test — [tarix]

### [Device] ([width]x[height])
- PASS: [keçən yoxlamalar]
- FAIL: [uğursuz yoxlamalar + fix təklifi]
- Screenshot: [əlavə olunur]
```

### 4. Auto-Fix (istifadəçi icazəsi ilə)
Aşkar olunan CSS problemlərini embed-ə əlavə edir:
```css
@media (max-width: XXXpx) {
  /* fix rule */
}
```
Sonra `/wix-embed-sync` çağırır.

## Yoxlama Checklist
- [ ] Nav menyu — mobile: gizli/hamburger, desktop: inline
- [ ] Cover başlıq — readability hər ölçüdə
- [ ] Axtarış bar — sticky hər ölçüdə
- [ ] Product grid — responsive sütunlar
- [ ] Contact form — full-width mobile
- [ ] Footer — responsive sütunlar
- [ ] Float buttons — mobile-da overlap yoxdur
- [ ] Horizontal scroll yoxdur (heç bir ölçüdə)
