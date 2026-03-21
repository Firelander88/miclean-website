---
name: wix-backup
description: >
  Backup and restore Wix CMS data for MI CLEAN GROUP. Use when the user wants to backup
  product data, export CMS to local files, restore from backup, or create data snapshots.
  Triggers on: "backup", "yedəklə", "export data", "data saxla", "restore", "bərpa et",
  "snapshot", "CMS backup", "data export", "məlumat yedəkləmə".
---

# Wix CMS Backup & Restore

Backup and restore MicleanKatalog CMS data to/from local files.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **Backup directory**: `excel_batches/backups/`

## Backup Workflow

### Step 1: Query All CMS Data
```
POST https://www.wixapis.com/wix-data/v2/items/query
Body: { "dataCollectionId": "MicleanKatalog", "query": { "paging": { "limit": 50, "offset": 0 } } }
```
Paginate through all items.

### Step 2: Save Locally
Save as timestamped JSON:
```
excel_batches/backups/backup_{YYYY-MM-DD_HHmm}.json
```

Format:
```json
{
  "collection": "MicleanKatalog",
  "timestamp": "2026-03-21T12:00:00Z",
  "totalItems": 490,
  "items": [...]
}
```

Also optionally export as Excel using `/xlsx`.

### Step 3: Verify
Compare item count in backup vs CMS to confirm completeness.

## Restore Workflow

### Step 1: Read Backup File
Load the specified backup JSON file.

### Step 2: Clear Current CMS (with confirmation!)
⚠️ ALWAYS ask user for confirmation before deleting:
```
POST https://www.wixapis.com/wix-data/v2/bulk/items/remove
```

### Step 3: Import Backup Data
```
POST https://www.wixapis.com/wix-data/v2/bulk/items/insert
```
25 items per batch.

### Step 4: Re-sync Catalog
Run `/wix-catalog-sync` after restore.

## Report

```
## Backup Hesabatı

**Tarix**: {date}
**Əməliyyat**: Backup / Restore
**Məhsul sayı**: {count}
**Fayl**: {filepath}
**Ölçü**: {filesize}
**Status**: ✅ Uğurlu
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Create new backup |
| `restore:{filepath}` | Restore from specific backup |
| `list` | List available backups |
| `compare` | Compare latest backup vs current CMS |
| `xlsx` | Backup as Excel file too |
| `auto` | Backup without confirmation prompts |
