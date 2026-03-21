---
name: wix-excel-import
description: >
  Excel/CSV to Wix CMS import pipeline for MI CLEAN GROUP. Use this skill when the user wants
  to import products from Excel or CSV files, bulk update CMS data from spreadsheets, or sync
  local data files with the Wix CMS collection. Triggers on: "Excel import", "CSV import",
  "məhsul əlavə et", "toplu yükləmə", "bulk import", "spreadsheet import", "Excel-dən CMS-ə",
  "yeni məhsullar yüklə", "data import", "məhsul siyahısı yüklə".
---

# Excel/CSV to Wix CMS Import

Import product data from Excel/CSV files into the MicleanKatalog CMS collection.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **CMS Fields**: title, kod, kateqoriya, altKateqoriya, terkib, catdirilmaMuddeti, istifadeMeqsedi, texnikiTesivr, istifadeSahesi, minSifaris, variantStr, description, shortDesc

## Workflow

### Step 1: Read Source File
Use the xlsx skill (`/xlsx`) or Node.js to read the Excel/CSV file:
```javascript
// For .xlsx files
const XLSX = require('xlsx');
const wb = XLSX.readFile('path/to/file.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
```

### Step 2: Map Columns
Map Excel columns to CMS fields. Common mappings:
| Excel Column | CMS Field |
|---|---|
| Məhsul adı / Product Name | title |
| Kod / SKU | kod |
| Kateqoriya / Category | kateqoriya |
| Alt kateqoriya / Subcategory | altKateqoriya |
| Tərkib / Composition | terkib |
| Həcm / Size / Variant | variantStr |

If columns don't match exactly, ask user to confirm mapping.

### Step 3: Deduplication & Merging
Group products by `kod` + base title (removing size suffix):
- Same kod + similar title = merge into one item with variant string
- Different kod = separate items
- ML → KQ conversion for cleaning chemicals (not hotel amenities)

### Step 4: Generate Descriptions
For items without descriptions, auto-generate using `/wix-content-az` patterns.

### Step 5: Import to CMS
```
POST https://www.wixapis.com/wix-data/v2/bulk/items/insert
Body: {
  "dataCollectionId": "MicleanKatalog",
  "dataItems": [{ "data": { ...fields } }]
}
```
- Max 25 items per batch
- Track successes and failures

### Step 6: Post-Import Sync
After import, suggest running `/wix-catalog-sync` to update the catalog display.

### Step 7: Report
```
## Import Hesabatı

| Metrika | Dəyər |
|---------|-------|
| Oxunan sətir | X |
| Dublikat birləşdirmə | Y |
| ML→KQ çevrilmə | Z |
| CMS-ə import | W |
| Uğursuz | F |

Növbəti addım: /wix-catalog-sync
```

## Error Handling

- Skip rows with empty title
- Log rows with invalid category names
- Handle encoding issues (UTF-8/Windows-1252)
- Report all skipped rows with reasons

## Args

| Arg | Action |
|---|---|
| `{filepath}` | Import from specified file |
| `preview` | Read and preview data without importing |
| `validate` | Validate data format without importing |
| `append` | Add new items (don't update existing) |
| `update` | Update existing items by kod match |
