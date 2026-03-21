---
name: wix-performance
description: >
  Performance analyzer and optimizer for MI CLEAN GROUP Wix site. Checks page load speed,
  embed sizes, script efficiency, and suggests optimizations. Triggers on: "performance",
  "sürət", "page speed", "yavaş", "slow", "optimize", "loading time", "embed size",
  "sayt sürəti", "performans", "optimallaşdır", "script size".
---

# Site Performance Analyzer

Analyze and optimize MI CLEAN GROUP Wix site performance.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Site URL**: `www.micleangroup.com`
- **Custom Embeds**: 6 (5 data + 1 UI)

## Performance Checks

### 1. Custom Embed Size Analysis
List all embeds and their HTML sizes:
```
GET https://www.wixapis.com/embeds/v1/custom-embeds
```
- Flag embeds over 15KB
- Calculate total embed payload
- Suggest compression if total > 60KB

### 2. Data Efficiency
- Count total products in embeds vs CMS
- Check for duplicate data across embeds
- Verify minimal field set (t, k, c, s, v)
- Suggest removing unused fields

### 3. Script Analysis
Review UI embed JavaScript for:
- Unnecessary DOM re-renders
- Missing event delegation
- Large array operations without pagination
- Memory leaks (event listeners not cleaned up)

### 4. Rendering Performance
Using Claude Preview:
- Measure time to first paint
- Check for layout shifts (CLS)
- Verify lazy loading where applicable
- Test with 490 product cards rendering

### 5. Network Analysis
Using `preview_network`:
- Check total page weight
- Identify slow requests
- Verify no unnecessary API calls
- Check for render-blocking resources

## Optimization Actions

### Embed Compression
- Shorten field names further if possible
- Remove products with zero variants from data embeds
- Implement virtual scrolling in UI (show 50 at a time)

### UI Optimizations
- Debounce search input (300ms)
- Use document fragment for batch DOM updates
- Implement pagination instead of rendering all 490 cards
- Add CSS containment for card grid

### Suggested UI Improvement Code
```javascript
// Virtual pagination — show 50 items per page
let page = 0, perPage = 50;
function renderPage() {
  const start = page * perPage;
  const visible = filtered.slice(start, start + perPage);
  // render only visible items
}
```

## Report Format

```
## ⚡ Performance Hesabatı

| Metrika | Dəyər | Hədəf | Status |
|---------|-------|-------|--------|
| Ümumi embed ölçüsü | {x} KB | <60 KB | ✅/⚠️ |
| Məhsul data ölçüsü | {x} KB | <50 KB | ✅/⚠️ |
| UI embed ölçüsü | {x} KB | <15 KB | ✅/⚠️ |
| İlk render vaxtı | {x} ms | <2000 ms | ✅/⚠️ |
| JS xətaları | {x} | 0 | ✅/❌ |

### Optimallaşdırma Tövsiyələri
{prioritized list}
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Full performance audit |
| `embeds` | Only analyze embed sizes |
| `fix` | Apply optimizations to embeds |
| `ui` | Optimize UI embed code |
