---
name: wix-social-calendar
description: >
  Social media content calendar and post creator for MI CLEAN GROUP. Use this skill when the
  user wants to plan social media content, create posts for LinkedIn/Instagram/Facebook,
  generate a content calendar, or manage social media strategy. Triggers on: "sosial media",
  "social post", "LinkedIn post", "Instagram", "Facebook", "content təqvim", "post yarat",
  "sosial media planı", "social calendar", "marketing plan".
---

# Social Media Content Calendar

Plan and create social media content for MI CLEAN GROUP across LinkedIn, Instagram, and Facebook.

## Brand Voice

- **LinkedIn**: Professional, educational, B2B focused
- **Instagram**: Visual, behind-the-scenes, product showcases
- **Facebook**: Community, tips, company updates
- **Language**: Azerbaijani (primary) + English (hashtags)
- **Hashtags**: #MiCleanGroup #PeşəkarTəmizlik #CleaningProfessionals #HotelSupplies #B2BAzerbaijan

## Content Pillars (4-week rotation)

### Week 1: Məhsul Təqdimatı (Product Showcase)
- Mon: LinkedIn — Product spotlight with specs
- Wed: Instagram — Product photo/carousel
- Fri: Facebook — "Bilirsinizmi?" product fact

### Week 2: Təmizlik Məsləhəti (Cleaning Tips)
- Mon: LinkedIn — Industry insight article share
- Wed: Instagram — Quick tip infographic
- Fri: Facebook — Video/reel tip

### Week 3: Müştəri Hekayəsi (Customer Story)
- Mon: LinkedIn — Case study / testimonial
- Wed: Instagram — Before/after photos
- Fri: Facebook — Customer quote card

### Week 4: Şirkət Xəbərləri (Company News)
- Mon: LinkedIn — Company update / milestone
- Wed: Instagram — Team / behind-the-scenes
- Fri: Facebook — Upcoming event / promo

## Post Templates

### LinkedIn Post
```
{Hook line — question or bold statement}

{2-3 paragraphs of value/insight}

{Key takeaways as bullet points}

🔗 Ətraflı: www.micleangroup.com/catalog
📞 Əlaqə: [phone]

#MiCleanGroup #PeşəkarTəmizlik #B2B #HotelSupplies
```

### Instagram Caption
```
{Short engaging first line} ✨

{2-3 lines of context}

{CTA — "Kataloq üçün bio-dakı linkə keçin"}

.
.
.
#MiCleanGroup #Təmizlik #CleaningProducts #HotelAmenities #Azerbaijan #Baku #B2B #ProfessionalCleaning
```

### Facebook Post
```
{Friendly opener}

{Value content — tip, news, or product info}

{CTA + link}

👉 www.micleangroup.com
```

## Calendar Output Format

```
## 📅 Sosial Media Təqvimi — {Month} {Year}

| Gün | Platform | Mövzu | Post Tipi | Status |
|-----|----------|-------|-----------|--------|
| {date} | LinkedIn | {topic} | Text + Image | 📝 Draft |
| {date} | Instagram | {topic} | Carousel | 📝 Draft |
...
```

## Canva Integration

For visual posts, use the `wix-brand-designer` skill or Canva MCP tools:
- `generate-design` for post graphics
- Export at platform-specific dimensions:
  - Instagram: 1080x1080 (feed), 1080x1920 (story)
  - LinkedIn: 1200x627
  - Facebook: 1200x630

## Args

| Arg | Action |
|---|---|
| (no arg) | Generate next week's calendar |
| `month` | Full month calendar |
| `linkedin` | Create LinkedIn post |
| `instagram` | Create Instagram post |
| `facebook` | Create Facebook post |
| `all` | Create posts for all platforms |
