---
name: wix-price-manager
description: >
  Price list manager for MI CLEAN GROUP. Creates, updates, and exports product price lists.
  Use when the user wants to manage prices, create price sheets, generate PDF price catalogs,
  or update pricing across products. Triggers on: "qiymət", "price list", "qiymət siyahısı",
  "qiymət cədvəli", "pricing", "qiymət yenilə", "price update", "qiymət PDF", "təklif qiyməti".
---

# Price List Manager

Manage product pricing and generate professional price lists for MI CLEAN GROUP.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **Currency**: AZN (Azerbaijani Manat)

## Features

### 1. Price List Generation
Query CMS products and create formatted price lists:
- Group by category → subcategory
- Include: title, kod, variants, price
- Export as Excel (`/xlsx`), PDF (`/pdf`), or display in chat

### 2. Price Update
Bulk update prices in CMS:
- From Excel file input
- Percentage increase/decrease across category
- Individual product price changes

### 3. Price Comparison
Compare current vs proposed prices:
- Show diff table
- Calculate margin impact

## Price List Template

```
## MI CLEAN GROUP — Qiymət Siyahısı
**Tarix**: {date}
**Valyuta**: AZN

### {Kateqoriya}

| # | Məhsul | Kod | Variant | Qiymət (AZN) |
|---|--------|-----|---------|-------------|
| 1 | {title} | {kod} | {variant} | {price} |

### Şərtlər
- Qiymətlərə ƏDV daxildir/daxil deyil
- Minimum sifariş: {min}
- Çatdırılma: {delivery}
- Qiymətlər {date} tarixinə aktualdır
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Show current price summary |
| `export:xlsx` | Export full price list as Excel |
| `export:pdf` | Export as PDF |
| `update:{filepath}` | Update prices from file |
| `category:{name}` | Price list for specific category |
| `increase:{percent}` | Calculate price increase preview |
