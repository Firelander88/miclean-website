---
name: wix-qa
description: >
  QA testing agent for the MI CLEAN GROUP Wix site. Use this skill when the user wants to
  test the site, find bugs, verify functionality, check responsive design, validate forms,
  or ensure everything works correctly after changes. Triggers on: "saytı test et", "QA",
  "bug tap", "yoxla", "test keçir", "xəta var?", "düzgün işləyir?", "responsive yoxla",
  "mobil test", "verify site", "check site", "sayt yoxlanışı".
---

# Wix Site QA Testing

You are a QA engineer testing the MI CLEAN GROUP website after changes.

## Site Context

- **Site URL**: `https://www.micleangroup.com`
- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Key Pages**: Home, Catalog (with 490 products), Contact, About
- **Features**: Product catalog with search/filter, contact form, quote request

## QA Checklist

### 1. Catalog Functionality
Use Claude Preview tools (`preview_start`, `preview_snapshot`, `preview_screenshot`) to verify:

- [ ] Catalog loads with all products (~490)
- [ ] Search works (test: "dezinfektan", "hotel", "mop")
- [ ] Category filter works (select each of 7 categories)
- [ ] Subcategory filter updates when category changes
- [ ] Category chips work correctly
- [ ] Product cards show: title, code, subcategory, variant tags
- [ ] Modal opens on card click with full details
- [ ] "Qiymət sorğusu" button in modal works
- [ ] Stats bar shows correct counts

### 2. Responsive Design
Use `preview_resize` to test:

- [ ] Desktop (1920x1080) — grid shows 3-4 columns
- [ ] Tablet (768x1024) — grid shows 2-3 columns
- [ ] Mobile (375x667) — grid shows 1-2 columns
- [ ] Search bar wraps properly on mobile
- [ ] Modal fits on mobile screens
- [ ] Category chips scroll horizontally on mobile

### 3. Performance
- [ ] Catalog loads within 3 seconds
- [ ] No JavaScript errors in console (`preview_console_logs`)
- [ ] No failed network requests (`preview_network`)
- [ ] Images load correctly

### 4. Content Verification
- [ ] All 7 categories present in filters
- [ ] Product count matches CMS (490)
- [ ] Azerbaijani text renders correctly (ə, ş, ç, ü, ö, ğ, ı)
- [ ] No broken HTML or escaped characters visible
- [ ] Variant tags display correctly (e.g., "1 kq / 5 kq / 10 kq")

### 5. Cross-Browser Basics
Check via `preview_snapshot` that:
- [ ] Layout doesn't break
- [ ] Fonts render properly
- [ ] Colors match brand (navy #0a2351, blue #1a73e8)

### 6. CMS Data Integrity
Use Wix API to verify:
```
POST https://www.wixapis.com/wix-data/v2/items/query
```
- [ ] Total item count matches expected (490)
- [ ] No items with empty titles
- [ ] Category distribution is correct

## Report Format

```
## 🧪 QA Test Hesabatı — MI CLEAN GROUP

**Tarix**: {date}
**Test edilən URL**: www.micleangroup.com

### Nəticə: {PASS / FAIL / PARTIAL}
**Keçən testlər**: {X}/{total}
**Uğursuz testlər**: {Y}/{total}

### Test Nəticələri
| # | Test | Nəticə | Qeyd |
|---|------|--------|------|
| 1 | Kataloq yüklənməsi | ✅/❌ | ... |
| 2 | Axtarış funksiyası | ✅/❌ | ... |
...

### Tapılan Buglar
{detailed bug descriptions with screenshots if available}

### Tövsiyələr
{prioritized list of fixes needed}
```

## How to Test

1. **If preview tools available**: Use `preview_start` to launch the site, then `preview_snapshot`, `preview_screenshot`, `preview_console_logs` etc.
2. **If no preview tools**: Use Wix API calls to verify CMS data integrity, embed presence, and site properties. Report that visual testing requires manual verification.
3. **Always**: Check CMS data via API regardless of preview availability.

## Args

| Arg | Action |
|---|---|
| (no arg) | Full QA test |
| `catalog` | Test only catalog functionality |
| `responsive` | Test only responsive design |
| `data` | Test only CMS data integrity |
| `quick` | Fast smoke test (load + basic checks) |
