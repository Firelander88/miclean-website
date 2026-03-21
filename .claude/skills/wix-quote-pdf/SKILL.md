---
name: wix-quote-pdf
description: >
  B2B quote/proposal PDF generator for MI CLEAN GROUP. Creates professional price quotations
  with company branding, product details, terms, and conditions. Use when the user wants to
  generate a quote, proposal, price offer, or commercial document for a client. Triggers on:
  "təklif", "quote", "quotation", "kommersiya təklifi", "price offer", "proposal",
  "qiymət təklifi", "PDF təklif", "müştəri təklifi", "tender", "smeta".
---

# B2B Quote PDF Generator

Generate professional branded quotations and proposals for MI CLEAN GROUP clients.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **Currency**: AZN (₼)
- **Company**: MI CLEAN GROUP MMC
- **Address**: Bakı, Azərbaycan

## Quote Structure

### Header
- MI CLEAN GROUP logo and branding
- Quote number: `MCG-{YYYY}-{sequential}`
- Date and validity period (default: 15 days)
- Client company name and contact

### Product Table
| # | Kod | Məhsul | Variant | Miqdar | Qiymət (₼) | Cəm (₼) |
|---|-----|--------|---------|--------|-------------|----------|

### Footer
- Subtotal, VAT (18%), Grand Total
- Payment terms
- Delivery terms
- Validity period
- Authorized signature line

## Workflow

### Step 1: Gather Quote Data
Either from user input or CMS query:
```
POST https://www.wixapis.com/wix-data/v2/items/query
Body: {
  "dataCollectionId": "MicleanKatalog",
  "query": {
    "filter": { "kod": { "$in": ["MCL-001", "MCL-002"] } }
  }
}
```

### Step 2: Build Quote Object
```json
{
  "quoteNumber": "MCG-2026-0042",
  "date": "2026-03-21",
  "validUntil": "2026-04-05",
  "client": {
    "company": "Grand Hotel Baku",
    "contact": "Əli Həsənov",
    "email": "ali@grandhotel.az"
  },
  "items": [
    { "kod": "MCL-001", "title": "...", "variant": "5L", "qty": 10, "price": 12.50 }
  ],
  "vatRate": 0.18,
  "paymentTerms": "30 gün",
  "deliveryTerms": "Bakı daxili pulsuz çatdırılma",
  "notes": ""
}
```

### Step 3: Generate PDF
Use the `/pdf` skill to create a professional PDF with:
- Company branding (navy #0a2351 header)
- Clean table layout
- Footer with terms
- Page numbers if multi-page

### Step 4: Save & Send
- Save to `excel_batches/quotes/MCG-2026-0042.pdf`
- Optionally email to client via contact form

## Terms Templates

### Standard B2B Terms (AZ)
```
Ödəniş şərtləri: Faktura tarixindən 30 gün ərzində
Çatdırılma: Bakı daxili sifarişlər pulsuz (minimum 100 AZN)
ƏDV: Qiymətlərə 18% ƏDV daxil deyil
Etibarlılıq: Bu təklif {validUntil} tarixinə qədər etibarlıdır
Minimum sifariş: Hər məhsul üzrə minimum sifariş miqdarı var
```

### Standard B2B Terms (EN)
```
Payment terms: Net 30 from invoice date
Delivery: Free delivery within Baku (minimum 100 AZN)
VAT: Prices exclude 18% VAT
Validity: This quotation is valid until {validUntil}
Minimum order: Minimum order quantities apply per product
```

## Brand Styling for PDF
- Header: Navy (#0a2351) background, white text
- Accent: Blue (#1a73e8) for highlights
- Font: Clean sans-serif
- Table: Alternating row colors (#f5f7fa)
- Footer: Gray (#5f6368) text

## Args

| Arg | Action |
|---|---|
| (no arg) | Interactive quote builder |
| `client:{name}` | Pre-fill client info |
| `products:{kod1,kod2}` | Pre-select products |
| `template:standard` | Use standard B2B template |
| `template:tender` | Use tender response template |
| `lang:en` | Generate in English |
| `lang:az` | Generate in Azerbaijani (default) |
