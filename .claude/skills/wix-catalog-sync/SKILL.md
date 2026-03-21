---
name: wix-catalog-sync
description: >
  Syncs the MI CLEAN GROUP product catalog between local data files and Wix Custom Embeds.
  Use this skill when: product data changes in CMS or local files and the catalog display
  needs updating, embed data is out of sync, new products are added, or the catalog UI needs
  refreshing. Triggers on: "kataloq sync", "embed yenilə", "catalog update", "sync products",
  "kataloq yenilə", "embed refresh", "məhsul əlavə et kataloqua".
---

# Wix Catalog Sync

Synchronizes product data from the MicleanKatalog CMS collection to the on-page Custom Embed catalog display.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **Embed IDs**:
  - Data 1: `eeafae6a-91c7-4ce3-8b4c-a0156af1e1d6`
  - Data 2: `20a8f2fe-299b-4533-bba4-29c2b614b8c9`
  - Data 3: `64e0e592-87a8-468d-9500-d10b660d147e`
  - Data 4: `956cadf3-c433-4fd7-a864-eccebe430d34`
  - Data 5: `d2bb7deb-817a-4259-8ae2-b141cee2ecc5`
  - UI: `301f494e-4436-4460-8572-38cce9272fa0`
- **Local files**: `excel_batches/embed_data_*.json`, `excel_batches/embed_html_*.html`

## Sync Workflow

### Step 1: Fetch Current CMS Data
Query all products from MicleanKatalog:
```
POST https://www.wixapis.com/wix-data/v2/items/query
Body: { "dataCollectionId": "MicleanKatalog", "query": { "paging": { "limit": 50, "offset": 0 } } }
```
Paginate through all items (offset 0, 50, 100, ...).

### Step 2: Compress for Embeds
Transform each product to minimal format:
```json
{"t": "title", "k": "kod", "c": "kateqoriya", "s": "altKateqoriya", "v": "variantStr (if non-empty)"}
```

### Step 3: Split into Chunks
Split compressed data into chunks that fit under ~14KB each when wrapped in HTML.
Write to `excel_batches/embed_data_N.json` and `excel_batches/embed_html_data_N.html`.

Data embed HTML format:
```html
<script>window._mcD=(window._mcD||[]).concat([...data...]);</script>
```

### Step 4: Update Embeds via API
For each data embed, call:
```
PATCH https://www.wixapis.com/embeds/v1/custom-embeds/{id}
Body: {
  "customEmbed": {
    "id": "{id}",
    "revision": "{current_revision}",
    "name": "MCatalog Data N",
    "enabled": true,
    "position": "BODY_END",
    "embedData": { "category": "ESSENTIAL", "html": "{embed_html}" }
  }
}
```

First GET each embed to obtain the current revision number.

### Step 5: Verify & Report
```
## Kataloq Sync Hesabatı

| Embed | Məhsul sayı | Ölçü | Status |
|-------|-------------|------|--------|
| Data 1 | X | Y KB | ✅ |
| Data 2 | X | Y KB | ✅ |
...

Ümumi: {total} məhsul sync edildi.
Publish etmək üçün: /wix-publish
```

## UI Embed Update

If the UI embed also needs updating (new features, design changes):
1. Read current UI from `excel_batches/embed_html_ui.html`
2. The UI reads data from `window._mcD` global variable
3. Features: search, category filter, subcategory filter, variant tags, modal detail view
4. Update via same PATCH API using the UI embed ID

## Args

| Arg | Action |
|---|---|
| (no arg) | Full sync: CMS → embeds |
| `check` | Compare CMS count vs embed count, report differences |
| `ui` | Update only the UI embed (not data) |
| `data` | Update only data embeds (not UI) |
