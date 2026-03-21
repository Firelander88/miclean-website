---
name: wix-publish
description: >
  Publishes the MI CLEAN GROUP Wix site and verifies deployment. Use this skill when the user
  wants to publish changes, deploy updates, make changes live, or verify the published site.
  Triggers on: "publish", "deploy", "saytı publish et", "canlıya çıxar", "dəyişiklikləri yayımla",
  "go live", "saytı yenilə", "yayımla".
---

# Wix Site Publisher

Publishes the MI CLEAN GROUP site and runs post-publish verification.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Site URL**: `www.micleangroup.com`

## Workflow

### Step 1: Pre-Publish Check
Before publishing, verify:
1. Query CMS item count — should be ~490
2. Check embed count — should be 6 (5 data + 1 UI)
3. Check for any recent errors

### Step 2: Publish
```
POST https://www.wixapis.com/site-publisher/v1/site/publish
Headers: wix-site-id: b770c699-0cb2-4b4e-914a-80a3e7280e48
```
Source: https://dev.wix.com/docs/api-reference/account-level/sites/site-actions/publish-site

### Step 3: Post-Publish Verification
Wait 5 seconds, then:
1. Check site properties are accessible
2. Verify CMS data is queryable
3. If preview tools available, take a screenshot of the live site

### Step 4: Report
```
## 🚀 Publish Hesabatı

**Tarix**: {date}
**Sayt**: www.micleangroup.com
**Status**: ✅ Uğurla publish edildi

### Pre-Publish Yoxlama
- CMS məhsul sayı: {count} ✅
- Custom Embeds: {count} ✅

### Post-Publish Yoxlama
- Sayt əlçatandır: ✅/❌
- CMS data yüklənir: ✅/❌

Sayt canlıdır: https://www.micleangroup.com
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Publish + verify |
| `check` | Pre-publish check only (don't publish) |
| `force` | Skip pre-publish checks, publish immediately |
