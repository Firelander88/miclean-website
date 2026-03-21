---
name: wix-crm
description: >
  CRM and contact/lead management for MI CLEAN GROUP via Wix CRM APIs. Manages contacts,
  leads, deals, and customer communications. Use this skill when the user wants to manage
  customers, view contacts, track leads, send emails to clients, or manage B2B relationships.
  Triggers on: "müştəri", "customer", "kontakt", "contact", "lead", "sövdələşmə", "deal",
  "CRM", "müştəri bazası", "client list", "əlaqə", "müştəri məlumatı", "potensial müştəri".
---

# Wix CRM & Contact Management

Manage contacts, leads, and B2B customer relationships for MI CLEAN GROUP.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Business Type**: B2B cleaning & hotel supplies
- **Primary Market**: Azerbaijan (Hotels, restaurants, hospitals, offices)

## API Reference

### Contacts

**Query Contacts**
```
POST https://www.wixapis.com/contacts/v4/contacts/query
Body: {
  "query": {
    "filter": { "info.name.first": { "$contains": "..." } },
    "paging": { "limit": 50 }
  }
}
```

**Create Contact**
```
POST https://www.wixapis.com/contacts/v4/contacts
Body: {
  "info": {
    "name": { "first": "...", "last": "..." },
    "emails": { "items": [{ "email": "..." }] },
    "phones": { "items": [{ "phone": "..." }] },
    "company": "...",
    "jobTitle": "..."
  }
}
```

**Update Contact**
```
PATCH https://www.wixapis.com/contacts/v4/contacts/{contactId}
Body: { "info": { ... }, "revision": "current_revision" }
```

### Labels (for segmentation)

**List Labels**
```
GET https://www.wixapis.com/contacts/v4/labels
```

**Assign Label**
```
POST https://www.wixapis.com/contacts/v4/contacts/{contactId}/labels
Body: { "labelKeys": ["custom.hotel", "custom.b2b"] }
```

### Extended Fields

**List Extended Fields**
```
GET https://www.wixapis.com/contacts/v4/extended-fields
```

## B2B Contact Schema

For MI CLEAN GROUP's B2B context, track these fields:

| Field | Purpose |
|---|---|
| Company Name | Business name |
| Contact Person | Primary contact |
| Phone | Direct line |
| Email | Business email |
| Sector | Hotel / Restaurant / Hospital / Office / Other |
| City | Bakı, Gəncə, Sumqayıt, etc. |
| Monthly Volume | Estimated monthly order volume |
| Products of Interest | Categories they buy |
| Last Order Date | When they last ordered |
| Status | Active / Prospect / Churned |

## Suggested Labels

Create these labels for B2B segmentation:
- `hotel` — Hotel clients
- `restaurant` — Restaurant/cafe clients
- `hospital` — Healthcare clients
- `office` — Office/corporate clients
- `distributor` — Distributors/resellers
- `vip` — High-value accounts
- `prospect` — Potential clients
- `churned` — Lost clients

## Workflows

### New Lead Capture
1. Form submission from website → Contact created automatically
2. Add label based on sector
3. Send welcome email via `/wix-email-campaign`
4. Add to prospect pipeline

### Client Outreach
1. Query contacts by label/segment
2. Generate personalized message
3. Send via email campaign skill

### Monthly Review
1. Query all contacts with "Active" status
2. Check last order dates
3. Flag at-risk accounts (no order > 60 days)
4. Generate outreach list

## Report Format

```
## 👥 CRM Hesabatı

**Tarix**: {date}

| Metrika | Dəyər |
|---------|-------|
| Ümumi kontaktlar | {total} |
| Aktiv müştərilər | {active} |
| Yeni (bu ay) | {new} |
| Risk altında | {at_risk} |

### Seqment üzrə
| Seqment | Say |
|---------|-----|
| Otellər | {x} |
| Restoranlar | {x} |
| Xəstəxanalar | {x} |
| Ofislər | {x} |
```

## Args

| Arg | Action |
|---|---|
| (no arg) | CRM overview dashboard |
| `list` | List all contacts |
| `add` | Add new contact interactively |
| `search:{query}` | Search contacts |
| `segment:{label}` | View contacts by segment |
| `at-risk` | Show at-risk accounts |
| `export` | Export contacts to Excel |
| `report` | Generate CRM report |
