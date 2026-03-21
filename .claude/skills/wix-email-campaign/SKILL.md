---
name: wix-email-campaign
description: >
  Email marketing campaign creator for MI CLEAN GROUP. Use this skill when the user wants to
  create email campaigns, newsletters, product announcements, promotional emails, or manage
  email marketing. Triggers on: "email kampaniya", "newsletter", "email göndər", "bületen",
  "email marketing", "aksiya email", "yeni məhsul elanı", "email template", "kampaniya yarat".
---

# Wix Email Campaign Creator

Create and manage email marketing campaigns for MI CLEAN GROUP via Wix Email Marketing API.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Business**: MI CLEAN GROUP — B2B cleaning supplies
- **Audience**: Hotel managers, procurement officers, facility managers
- **Language**: Azerbaijani + English technical terms

## Email Marketing API

### List Campaigns
```
GET https://www.wixapis.com/email-marketing/v1/campaigns
```

### Get Campaign
```
GET https://www.wixapis.com/email-marketing/v1/campaigns/{campaignId}
```

### Publish/Send Campaign
```
POST https://www.wixapis.com/email-marketing/v1/campaigns/{campaignId}/publish
```

### List Campaign Statistics
```
GET https://www.wixapis.com/email-marketing/v1/campaigns/{campaignId}/statistics
```

Note: Campaign creation may require the Wix Editor. If the API doesn't support direct creation, guide the user to create the template in Wix, then use the API to manage and send.

## Campaign Types

### 1. Aylıq Bületen (Monthly Newsletter)
- Subject: "MI CLEAN GROUP — {Month} Bületen"
- Sections: Yeni məhsullar, təmizlik məsləhəti, xüsusi təklif
- CTA: Kataloqa bax, Əlaqə saxla

### 2. Yeni Məhsul Elanı (Product Launch)
- Subject: "Yeni: {Product Name} — İndi Mövcuddur"
- Hero image + product details + variant list
- CTA: Qiymət sorğusu göndər

### 3. Mövsümi Kampaniya (Seasonal)
- Subject: "{Season} təmizlik kampaniyası — Xüsusi təkliflər"
- Seasonal product recommendations
- CTA: Topdan sifariş üçün əlaqə

### 4. Sənaye Xəbərləri (Industry News)
- Subject: "Təmizlik sənayesində yeniliklər — {Month}"
- 3-4 short news items with links
- CTA: Blog-umuzu izləyin

## Email Subject Line Rules

- Max 50 characters
- Include company name or keyword
- Create urgency or curiosity
- A/B test variants when possible

## Workflow

1. **Check existing campaigns** — list via API
2. **Identify audience** — all contacts or segment
3. **Draft content** — use templates above
4. **Create/update campaign** — via API or guide user to Wix Editor
5. **Preview and confirm** — show user the draft
6. **Send** — only after explicit user approval
7. **Report** — show send stats after delivery

## Args

| Arg | Action |
|---|---|
| (no arg) | Show campaign templates, suggest next campaign |
| `list` | List all campaigns with stats |
| `newsletter` | Draft monthly newsletter |
| `product:{name}` | Draft product launch email |
| `stats` | Show campaign performance stats |
