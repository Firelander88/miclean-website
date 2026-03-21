---
name: wix-analytics
description: >
  Site analytics and reporting for MI CLEAN GROUP Wix site. Retrieves visitor data, page
  views, traffic sources, conversion metrics, and generates actionable insights. Use when
  the user wants to see site statistics, traffic data, visitor behavior, or understand how
  their site is performing. Triggers on: "analitika", "analytics", "statistika", "traffic",
  "ziyarətçi", "visitor", "page views", "səhifə baxışı", "conversion", "çevrilmə",
  "site stats", "sayt statistikası", "bounce rate", "performans göstəriciləri".
---

# Wix Site Analytics & Reporting

Retrieve and analyze site performance data for MI CLEAN GROUP.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Site URL**: `www.micleangroup.com`

## API Reference

### Site Analytics
```
POST https://www.wixapis.com/analytics/v2/reports/query
Body: {
  "query": {
    "dateRange": {
      "startDate": "2026-03-01",
      "endDate": "2026-03-21"
    },
    "metrics": ["SESSIONS", "PAGE_VIEWS", "UNIQUE_VISITORS", "BOUNCE_RATE"],
    "dimensions": ["DATE"]
  }
}
```

### Available Metrics
| Metric | Description |
|---|---|
| SESSIONS | Total sessions |
| PAGE_VIEWS | Total page views |
| UNIQUE_VISITORS | Unique visitors |
| BOUNCE_RATE | Single-page sessions % |
| AVG_SESSION_DURATION | Average time on site |
| NEW_VISITORS | First-time visitors |
| RETURNING_VISITORS | Repeat visitors |

### Available Dimensions
| Dimension | Description |
|---|---|
| DATE | Daily breakdown |
| PAGE_PATH | By page URL |
| TRAFFIC_SOURCE | Where visitors come from |
| DEVICE_TYPE | Desktop/Mobile/Tablet |
| COUNTRY | Visitor country |
| BROWSER | Browser type |

## Key Reports

### 1. Traffic Overview
Daily/weekly/monthly visitor trends:
- Total sessions & unique visitors
- Page views & pages per session
- Bounce rate trend
- New vs returning visitors

### 2. Top Pages
Most visited pages:
- Homepage performance
- Catalog page engagement
- Contact page conversions
- Blog post performance (if applicable)

### 3. Traffic Sources
Where visitors come from:
- Direct traffic
- Organic search
- Social media
- Referral sites
- Email campaigns

### 4. Device Breakdown
- Desktop vs Mobile vs Tablet
- Mobile optimization priority

### 5. Geographic Data
- Visitor locations (focus on Azerbaijan cities)
- International traffic

## Dashboard Format

```
## 📊 Analitika Hesabatı

**Dövr**: {startDate} — {endDate}
**Sayt**: www.micleangroup.com

### Ümumi Göstəricilər
| Metrika | Dəyər | Dəyişim |
|---------|-------|---------|
| Sessiyalar | {sessions} | {change}% |
| Unikal Ziyarətçilər | {unique} | {change}% |
| Səhifə Baxışları | {pageViews} | {change}% |
| Bounce Rate | {bounce}% | {change}% |
| Ort. Sessiya Müddəti | {avgDuration} | {change}% |

### Ən Populyar Səhifələr
| # | Səhifə | Baxış | Bounce |
|---|--------|-------|--------|
| 1 | {page} | {views} | {rate}% |

### Trafik Mənbələri
| Mənbə | Sessiya | Pay |
|-------|---------|-----|
| Birbaşa | {x} | {y}% |
| Axtarış | {x} | {y}% |
| Sosial | {x} | {y}% |
| Referal | {x} | {y}% |

### Cihaz Paylanması
| Cihaz | Pay |
|-------|-----|
| Desktop | {x}% |
| Mobil | {x}% |
| Tablet | {x}% |

### Tövsiyələr
{actionable insights based on data}
```

## Automated Insights

Based on analytics data, auto-generate insights:
- If bounce rate > 60%: suggest UX improvements
- If mobile traffic > 50% but no mobile optimization: flag priority
- If organic traffic is low: suggest SEO improvements
- If specific pages have high exit rates: suggest content improvements
- If returning visitors < 20%: suggest engagement strategies

## Args

| Arg | Action |
|---|---|
| (no arg) | Last 30 days overview |
| `today` | Today's stats |
| `week` | Last 7 days |
| `month` | Last 30 days |
| `quarter` | Last 90 days |
| `pages` | Top pages report |
| `sources` | Traffic sources report |
| `devices` | Device breakdown |
| `compare` | Compare current vs previous period |
| `export` | Export analytics to Excel |
