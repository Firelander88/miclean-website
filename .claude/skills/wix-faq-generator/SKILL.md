---
name: wix-faq-generator
description: >
  FAQ content generator for MI CLEAN GROUP. Creates frequently asked questions and answers
  based on product categories, customer needs, and industry knowledge. Use when the user
  wants FAQ content, help pages, knowledge base articles, or customer support content.
  Triggers on: "FAQ yarat", "sual-cavab", "tez-tez verilən suallar", "FAQ page",
  "müştəri sualları", "help content", "knowledge base", "sual əlavə et".
---

# FAQ Content Generator

Generate comprehensive FAQ content for MI CLEAN GROUP in Azerbaijani.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog`
- **Language**: Azerbaijani

## FAQ Categories

### 1. Ümumi Suallar (General)
- MI CLEAN GROUP nədir?
- Hansı sektorlara xidmət göstərirsiniz?
- Minimum sifariş miqdarı nə qədərdir?
- Çatdırılma müddəti nə qədərdir?
- Ödəniş üsulları hansılardır?
- Topdan qiymət almaq üçün nə etməliyəm?

### 2. Məhsul Sualları (Product-specific)
For each category, generate 5-8 relevant FAQs:

**Kimyəvi Təmizlik Vasitələri:**
- Konsentrat və hazır istifadə (RTU) arasındakı fərq nədir?
- Hansı dezinfektan məhsullar qida sənayesi üçün uyğundur?
- Təmizlik vasitələrinin saxlanma şərtləri nədir?

**Hotel Amenity:**
- Otel amenity məhsullarına logo çap edə bilərsiniz?
- Minimum sifariş miqdarı nə qədərdir?
- Hansı ölçü və variantlar mövcuddur?

**Camaşırxana:**
- Sənaye camaşırxanası üçün hansı məhsulları tövsiyə edirsiniz?
- Dozaj sistemi necə işləyir?

### 3. Sifariş & Çatdırılma
- Necə sifariş verə bilərəm?
- Bakı xaricində çatdırılma var?
- Qaytarma siyasəti nədir?
- Nümunə (sample) ala bilərəm?

### 4. Texniki Suallar
- MSDS (Material Safety Data Sheet) ala bilərəm?
- Məhsullarınız ISO sertifikatlıdır?
- Eco-friendly məhsullarınız var?

## Output Formats

### HTML Embed Format
Generate as a Custom Embed for the Wix site:
```html
<div class="faq-section">
  <div class="faq-item">
    <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">
      <span>Sual mətni?</span><span class="arrow">▸</span>
    </div>
    <div class="faq-a">Cavab mətni.</div>
  </div>
</div>
```

### CMS Collection Format
Create a new `FAQ` CMS collection:
```json
{
  "question": "Sual?",
  "answer": "Cavab",
  "category": "Ümumi",
  "order": 1
}
```

### Structured Data (JSON-LD)
Generate FAQPage schema for SEO:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Sual?",
      "acceptedAnswer": { "@type": "Answer", "text": "Cavab." }
    }
  ]
}
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Generate full FAQ set (all categories) |
| `general` | Only general FAQs |
| `product` | Product-specific FAQs from CMS data |
| `embed` | Generate as HTML embed for Wix |
| `schema` | Generate JSON-LD structured data |
| `category:{name}` | FAQs for specific product category |
