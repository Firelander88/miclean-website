---
name: wix-competitor-watch
description: >
  Competitor analysis and market intelligence for MI CLEAN GROUP. Researches competitor
  websites, products, pricing strategies, and market positioning. Use when the user wants
  to analyze competitors, compare products, understand market trends, or benchmark against
  industry standards. Triggers on: "rəqib", "competitor", "rəqib analizi", "bazaar araşdırma",
  "market research", "müqayisə", "benchmark", "rəqib sayt", "qiymət müqayisəsi", "bazar".
---

# Competitor Analysis & Market Intelligence

Research and analyze competitors in Azerbaijan's B2B cleaning and hotel supplies market.

## Company Context

- **Company**: MI CLEAN GROUP MMC
- **Market**: Azerbaijan B2B cleaning & hotel supplies
- **Segments**: Chemical cleaning, laundry, kitchen hygiene, hotel amenities, housekeeping, pool cleaning
- **Target Clients**: Hotels, restaurants, hospitals, offices, industrial facilities

## Analysis Framework

### 1. Competitor Identification
Research competitors via web search:
- Direct competitors (same products, same market)
- Indirect competitors (imported brands, distributors)
- Online-only competitors

### 2. Website Analysis
For each competitor site, evaluate:

| Criteria | What to Check |
|---|---|
| Product Range | Number of products, categories, coverage |
| Pricing Visibility | Public prices vs quote-only |
| Content Quality | Descriptions, images, technical specs |
| SEO Presence | Meta tags, blog, keyword targeting |
| User Experience | Navigation, mobile, speed |
| Trust Signals | Certifications, testimonials, client logos |
| Online Ordering | E-commerce capability |
| Language Support | AZ, EN, RU, TR |

### 3. Product Comparison Matrix
```
| Feature | MI CLEAN | Competitor A | Competitor B |
|---------|----------|-------------|-------------|
| Total Products | 490 | ? | ? |
| Categories | 7 | ? | ? |
| Online Catalog | ✅ | ? | ? |
| Pricing Public | ❌ | ? | ? |
| Technical Specs | ✅ | ? | ? |
| AZ Language | ✅ | ? | ? |
```

### 4. SWOT Analysis
Generate for MI CLEAN GROUP vs competitors:
- **Strengths**: What MI CLEAN does better
- **Weaknesses**: Gaps to address
- **Opportunities**: Unmet market needs
- **Threats**: Competitive risks

### 5. SEO Competitive Analysis
Compare keyword rankings:
- "təmizlik vasitələri Bakı"
- "otel təchizatı Azərbaycan"
- "kimyəvi təmizlik məhsulları"
- "camaşırxana məhsulları"
- "hotel amenities Azerbaijan"

## Research Tools

Use `WebSearch` and `WebFetch` to:
1. Search for competitors in the Azerbaijan cleaning supplies market
2. Analyze competitor websites
3. Check competitor social media presence
4. Research industry trends

## Report Format

```
## 🔍 Rəqib Analizi Hesabatı

**Tarix**: {date}
**Sektor**: B2B Təmizlik və Otel Təchizatı

### Əsas Rəqiblər

| # | Şirkət | Sayt | Məhsul Sayı | Güclü Tərəf |
|---|--------|------|-------------|-------------|
| 1 | {name} | {url} | {count} | {strength} |

### MI CLEAN GROUP Mövqeyi
**Bazarda yer**: {position}
**Əsas üstünlüklər**: {advantages}
**Təkmilləşdirmə sahələri**: {improvements}

### SWOT
| Güclü tərəflər | Zəif tərəflər |
|---|---|
| {list} | {list} |

| İmkanlar | Təhdidlər |
|---|---|
| {list} | {list} |

### Tövsiyələr
1. {prioritized action items}
```

## Args

| Arg | Action |
|---|---|
| (no arg) | Full competitive analysis |
| `quick` | Quick overview of top 5 competitors |
| `seo` | SEO-focused competitive analysis |
| `product:{category}` | Compare specific product category |
| `swot` | Generate SWOT analysis only |
| `report` | Generate detailed PDF report |
