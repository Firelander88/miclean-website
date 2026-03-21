---
name: wix-seo
description: >
  Comprehensive Wix SEO auditor and auto-fixer. Use this skill whenever the user mentions SEO,
  meta tags, search engine optimization, Google ranking, sitemap, robots.txt, page titles,
  meta descriptions, alt text, or wants to improve their Wix site's search visibility.
  Also triggers on: "SEO audit", "SEO score", "optimize for Google", "search ranking",
  "meta yaz", "SEO yoxla", "axtarış optimizasiyası". Runs audit or fix mode on all site
  pages and CMS collections, generates a scored report, and auto-fixes issues when requested.
---

# Wix SEO Audit & Auto-Fix

You are a Wix SEO specialist. Your job is to audit a Wix site's SEO health and optionally auto-fix issues found.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Site URL**: `www.micleangroup.com`
- **CMS Collection**: `MicleanKatalog`
- **Language**: Azerbaijani (az)
- **Business**: MI CLEAN GROUP — B2B professional cleaning supplies, hotel amenities, industrial chemicals

## Modes

Parse the user's input (or args) to determine the mode:

| Arg / Intent | Mode | Behavior |
|---|---|---|
| `audit` or no arg | **Audit** | Read-only scan, report issues, suggest fixes |
| `fix` | **Fix** | Scan + auto-fix all issues found |
| `report` | **Report** | Generate detailed SEO report only |

## Audit Checklist

Run each check in order. For each, use the appropriate Wix API.

### 1. Site Properties Check
**API**: `GET https://www.wixapis.com/site-properties/v4/properties`
- Verify business name, description, logo, favicon are set
- Check business category and locale settings
- Score: 10 points

### 2. Page Meta Tags
**API**: `GET https://www.wixapis.com/viewer/v1/seo-tags/static-page/resolve`
- For each major page (home, catalog, contact, about):
  - Check meta title exists and is 30-60 characters
  - Check meta description exists and is 120-160 characters
  - Verify Open Graph tags (og:title, og:description, og:image)
  - Check for duplicate titles across pages
- Score: 25 points

### 3. CMS Content SEO
**API**: `POST https://www.wixapis.com/wix-data/v2/items/query` on `MicleanKatalog`
- Query all items and check:
  - `title` field is not empty (product name)
  - `description` field is not empty
  - `shortDesc` field is not empty
  - No duplicate titles
  - Title length is reasonable (under 80 chars)
- Count items with missing descriptions
- Score: 25 points

### 4. Robots.txt
**API**: `GET https://www.wixapis.com/promote-seo/v1/robots-txt`
- Verify robots.txt exists and is properly configured
- Check that important pages are not blocked
- Verify sitemap reference is included
- Score: 10 points

### 5. Custom Embeds SEO Impact
**API**: `GET https://www.wixapis.com/embeds/v1/custom-embeds`
- Check that custom embeds don't block rendering
- Verify embed HTML doesn't contain SEO-harmful patterns
- Score: 10 points

### 6. Business Profile Completeness
**API**: `GET https://www.wixapis.com/site-properties/v4/properties`
- Business name, address, phone, email
- Business hours
- Social media links
- Score: 10 points

### 7. Structured Data Check
- Verify JSON-LD structured data presence
- Check for Organization, Product, LocalBusiness schemas
- Score: 10 points

## Auto-Fix Actions (Fix Mode Only)

When in fix mode, apply these corrections:

### Meta Title Generation
For pages missing titles, generate in this format:
- Home: `MI CLEAN GROUP — Peşəkar Təmizlik Həlləri`
- Catalog: `Məhsul Kataloqu | MI CLEAN GROUP`
- Contact: `Əlaqə | MI CLEAN GROUP`
- About: `Haqqımızda | MI CLEAN GROUP`

### Meta Description Generation
Generate Azerbaijani descriptions, 120-160 chars, including:
- Primary keyword
- Value proposition
- Call to action

Example: `MI CLEAN GROUP — 490+ peşəkar təmizlik məhsulu, otel amenity və sənaye kimyəvi vasitələri. B2B topdan satış. Pulsuz kataloq üçün əlaqə saxlayın.`

### CMS Content Enrichment
For products with empty `description` or `shortDesc`:
- Generate based on: title, kateqoriya, altKateqoriya, variantStr
- Description format: `{kateqoriya} kateqoriyasında {altKateqoriya} üçün peşəkar {title}. Variantlar: {variantStr}`
- Use `POST https://www.wixapis.com/wix-data/v2/bulk/items/update` to push fixes

### Robots.txt Optimization
If robots.txt is default/empty, set optimal config:
```
User-agent: *
Allow: /
Sitemap: https://www.micleangroup.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

Use `PUT https://www.wixapis.com/promote-seo/v1/robots-txt` to update.

## Report Format

Always output the report in this exact structure:

```
## 🔍 SEO Audit Report — MI CLEAN GROUP
**Tarix**: {current date}
**Rejim**: {Audit / Fix}
**Sayt**: www.micleangroup.com

### Ümumi SEO Balı: {score}/100

| # | Yoxlama | Bal | Status |
|---|---------|-----|--------|
| 1 | Sayt Xüsusiyyətləri | {x}/10 | ✅/⚠️/❌ |
| 2 | Səhifə Meta Tagları | {x}/25 | ✅/⚠️/❌ |
| 3 | CMS Məzmun SEO | {x}/25 | ✅/⚠️/❌ |
| 4 | Robots.txt | {x}/10 | ✅/⚠️/❌ |
| 5 | Custom Embeds | {x}/10 | ✅/⚠️/❌ |
| 6 | Biznes Profili | {x}/10 | ✅/⚠️/❌ |
| 7 | Strukturlaşdırılmış Data | {x}/10 | ✅/⚠️/❌ |

### Tapılan Problemlər
{numbered list of issues}

### Düzəldilən Problemlər (yalnız Fix rejimində)
{numbered list of fixes applied}

### Manual Tapşırıqlar
{things that need human intervention}

### Tövsiyələr
{prioritized recommendations}
```

## Error Handling

- If an API returns 403, note the permission issue and skip that check
- If an API returns 404, the feature may not be installed — note and continue
- Never fail the entire audit due to one check failing
- Always produce a partial report even if some checks fail

## Important Notes

- Always query CMS with `limit: 50` and paginate if needed — don't try to load all 490 items at once
- For CMS updates in fix mode, use bulk operations with max 25 items per batch
- Generate all text content in Azerbaijani unless the original is in English
- Preserve existing valid meta tags — only fix missing or broken ones
- After fixes, suggest running `/wix-publish` to make changes live
