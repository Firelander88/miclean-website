---
name: wix-report
description: >
  Monthly/weekly report generator for MI CLEAN GROUP. Creates comprehensive PPTX or PDF
  reports combining analytics, SEO, CMS, CRM, and business metrics. Use when the user
  wants a periodic report, business summary, management presentation, or status update
  about the Wix site and business. Triggers on: "hesabat", "report", "aylıq hesabat",
  "monthly report", "prezentasiya", "presentation", "status", "icmal", "summary",
  "nəticə hesabatı", "management report", "business review".
---

# Monthly/Weekly Report Generator

Generate comprehensive business and site reports for MI CLEAN GROUP management.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Company**: MI CLEAN GROUP MMC
- **Site URL**: www.micleangroup.com

## Report Types

### 1. Monthly Business Report (PPTX)
Full executive presentation covering all aspects:
- Site traffic & engagement
- Product catalog status
- SEO performance
- CRM/lead summary
- Action items for next month

### 2. Weekly Status Report (PDF)
Quick operational summary:
- Key metrics changes
- Issues found & fixed
- Pending tasks

### 3. Custom Report
User-defined scope and metrics.

## Data Sources

Aggregate data from multiple skills:

| Source | Skill | Data |
|---|---|---|
| Analytics | `/wix-analytics` | Traffic, visitors, bounce rate |
| SEO | `/wix-seo` | SEO score, rankings, issues |
| CMS | `/wix-catalog-sync` | Product count, categories |
| CRM | `/wix-crm` | Contacts, leads, segments |
| Performance | `/wix-performance` | Load times, embed sizes |
| Accessibility | `/wix-a11y` | WCAG score, issues |
| QA | `/wix-qa` | Bug count, test results |

## Monthly Report Structure (PPTX)

### Slide 1: Cover
- MI CLEAN GROUP — Aylıq Hesabat
- Period: {month} {year}
- Prepared by: Claude AI Agent

### Slide 2: Executive Summary
- 3-5 key highlights
- Overall health score
- Critical action items

### Slide 3: Site Traffic
- Visitor trend chart
- Key metrics table
- Traffic source breakdown

### Slide 4: Product Catalog
- Total products: {count}
- New products added: {new}
- Categories breakdown
- Most viewed products

### Slide 5: SEO Performance
- SEO score: {score}/100
- Keyword rankings
- Issues fixed vs remaining
- Organic traffic trend

### Slide 6: Customer/Lead Summary
- New contacts: {count}
- Active clients: {count}
- Lead conversion rate
- Top segments

### Slide 7: Technical Health
- Performance score
- Accessibility score
- QA test results
- Uptime status

### Slide 8: Action Items
- Priority tasks for next month
- Assigned responsibilities
- Deadlines

### Slide 9: Appendix
- Detailed metrics tables
- Comparison with previous month

## Workflow

### Step 1: Collect Data
Run data collection from all sources:
```
1. Query analytics API for traffic data
2. Run SEO audit for current score
3. Query CMS for product stats
4. Query CRM for contact stats
5. Run performance check
```

### Step 2: Analyze & Compare
- Compare with previous period
- Calculate growth/decline percentages
- Identify trends and anomalies

### Step 3: Generate Report
Use `/pptx` skill for presentations or `/pdf` skill for PDF reports.

### Step 4: Deliver
- Save to `excel_batches/reports/`
- Filename: `MI_CLEAN_Report_{YYYY-MM}.pptx`

## Health Score Calculation

Overall site health (0-100):
| Component | Weight | Source |
|---|---|---|
| SEO Score | 20% | /wix-seo |
| Performance | 20% | /wix-performance |
| Accessibility | 15% | /wix-a11y |
| Content Quality | 15% | CMS completeness |
| QA Score | 15% | /wix-qa |
| Traffic Growth | 15% | /wix-analytics |

## Report Branding

- Primary color: #0a2351 (navy)
- Accent: #1a73e8 (blue)
- Charts: Blue gradient palette
- Font: Clean, professional sans-serif
- Logo placement: Top-right on each slide

## Args

| Arg | Action |
|---|---|
| (no arg) | Monthly report for current month |
| `weekly` | Weekly status report |
| `month:{YYYY-MM}` | Report for specific month |
| `pptx` | Generate as PPTX (default) |
| `pdf` | Generate as PDF |
| `quick` | Quick summary without detailed slides |
| `compare` | Include month-over-month comparison |
| `custom:{sections}` | Only include specified sections |
