---
name: wix-i18n
description: >
  Multi-language (internationalization) support for MI CLEAN GROUP Wix site. Manages
  translations for AZ/EN/RU/TR languages across CMS content, embeds, and site pages.
  Use this skill when the user wants to translate content, add language versions, manage
  multilingual product data, or set up language switching. Triggers on: "tərcümə",
  "translate", "dil", "language", "çoxdilli", "multilingual", "i18n", "EN version",
  "RU version", "TR version", "ingiliscə", "rusca", "türkcə", "localization".
---

# Multi-Language Support (i18n)

Manage translations and multilingual content for MI CLEAN GROUP across AZ, EN, RU, and TR.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Primary Language**: Azerbaijani (AZ)
- **Target Languages**: English (EN), Russian (RU), Turkish (TR)
- **CMS Collection**: `MicleanKatalog`

## Language Priority

1. **AZ** — Primary, all content exists
2. **TR** — Closest linguistically, easiest translations
3. **RU** — Important for regional B2B clients
4. **EN** — International reach

## Translation Scope

### CMS Product Fields
| Field | Translate? | Notes |
|---|---|---|
| title | ✅ | Product name |
| description | ✅ | Full description |
| shortDesc | ✅ | Short description |
| kateqoriya | ✅ | Category name |
| altKateqoriya | ✅ | Subcategory |
| terkib | ✅ | Composition/ingredients |
| istifadeMeqsedi | ✅ | Usage purpose |
| texnikiTesivr | ✅ | Technical description |
| istifadeSahesi | ✅ | Usage area |
| kod | ❌ | Universal SKU |
| variantStr | ❌ | Numeric values |

### UI Elements
- Navigation labels
- Button text (Göndər, Ətraflı, Filtr)
- Placeholder text
- Error messages
- Category names in catalog embed

## Translation Workflow

### Step 1: Extract Source Content
Query CMS for all AZ content:
```
POST https://www.wixapis.com/wix-data/v2/items/query
Body: { "dataCollectionId": "MicleanKatalog", "query": { "paging": { "limit": 50 } } }
```

### Step 2: Generate Translations
Use Claude to translate, maintaining:
- Technical accuracy (chemical names, concentrations)
- B2B tone
- Brand terminology consistency
- SEO keywords per language

### Step 3: Store Translations
Option A — Separate CMS collections per language:
```
MicleanKatalog_EN, MicleanKatalog_RU, MicleanKatalog_TR
```

Option B — Additional fields in same collection:
```
title_en, title_ru, title_tr, description_en, ...
```

Option C — JSON field with all translations:
```json
{ "translations": { "en": { "title": "..." }, "ru": { "title": "..." } } }
```

Recommend **Option A** for cleaner CMS management.

### Step 4: Update Catalog Embeds
Generate language-specific data embeds or add language switching to UI embed.

## UI Language Switcher
```html
<div class="mc-lang">
  <button onclick="setLang('az')" class="active">AZ</button>
  <button onclick="setLang('en')">EN</button>
  <button onclick="setLang('ru')">RU</button>
  <button onclick="setLang('tr')">TR</button>
</div>
<script>
function setLang(lang) {
  localStorage.setItem('mc_lang', lang);
  window.location.reload();
}
</script>
```

## Translation Quality Rules

### Chemical Products
- Keep IUPAC names in original form
- Translate common names: "Ağardıcı" → "Bleach" (EN) / "Отбеливатель" (RU) / "Ağartıcı" (TR)
- Keep concentration values unchanged: "5% NaOCl"

### Hotel Amenities
- Use international hotel industry terms
- Keep brand names unchanged
- Translate size descriptions

### Category Translations
| AZ | EN | RU | TR |
|---|---|---|---|
| Kimyəvi Təmizlik Vasitələri | Chemical Cleaning Products | Химические чистящие средства | Kimyasal Temizlik Ürünleri |
| Camaşırxana Məhsulları | Laundry Products | Прачечная продукция | Çamaşırhane Ürünleri |
| Hotel Amenity | Hotel Amenities | Гостиничные принадлежности | Otel Malzemeleri |
| Housekeeping Alətləri | Housekeeping Tools | Инструменты для уборки | Temizlik Araçları |

## Args

| Arg | Action |
|---|---|
| (no arg) | Show translation status overview |
| `translate:en` | Translate all content to English |
| `translate:ru` | Translate all content to Russian |
| `translate:tr` | Translate all content to Turkish |
| `product:{kod}` | Translate specific product |
| `category:{name}` | Translate specific category |
| `ui` | Generate UI translations for embeds |
| `status` | Show translation completion % per language |
