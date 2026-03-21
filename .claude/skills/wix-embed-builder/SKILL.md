---
name: wix-embed-builder
description: >
  Custom HTML/CSS/JS embed component builder for Wix sites. Creates interactive widgets,
  forms, calculators, product displays, and UI components as Custom Embeds. Use this skill
  whenever the user wants to build a custom component, widget, embed, interactive element,
  or inject custom HTML/CSS/JS into their Wix site. Triggers on: "embed", "widget",
  "custom component", "HTML inject", "komponent", "vidjet", "kalkulyator", "calculator",
  "form builder", "custom element", "embed yarat", "interactive", "CSS inject".
---

# Custom Embed Builder

Build and deploy custom HTML/CSS/JS components as Wix Custom Embeds for MI CLEAN GROUP.

## Site Context

- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **Existing Embeds**: 6 (5 data + 1 UI for catalog)
- **Max Embed Size**: ~15KB HTML per embed
- **Embed Placement**: BODY_END (default), HEAD, BODY_START

## Critical: How Custom Embeds Work on Wix

Custom Embeds inject directly into the page DOM — they are NOT iframes. This means:
- `window.parent.postMessage` will NOT work (there is no parent)
- Use `window._variableName` for data sharing between embeds
- All CSS is shared with the page — use scoped selectors or unique prefixes
- Scripts execute in the main page context

## API Reference

### List Embeds
```
GET https://www.wixapis.com/embeds/v1/custom-embeds
```

### Create Embed
```
POST https://www.wixapis.com/embeds/v1/custom-embeds
Body: {
  "customEmbed": {
    "title": "Component Name",
    "code": "<div>...</div><style>...</style><script>...</script>",
    "placement": "BODY_END"
  }
}
```

### Update Embed
```
PATCH https://www.wixapis.com/embeds/v1/custom-embeds/{id}
Body: {
  "customEmbed": {
    "title": "...",
    "code": "...",
    "revision": "current_revision"
  }
}
```
The `revision` field is REQUIRED for updates — fetch current embed first to get it.

### Delete Embed
```
DELETE https://www.wixapis.com/embeds/v1/custom-embeds/{id}
```

## Component Templates

### Contact/Quote Form
```html
<div id="mcForm" class="mc-form">
  <h3>Təklif Sorğusu</h3>
  <input type="text" placeholder="Ad, Soyad" required>
  <input type="email" placeholder="E-poçt" required>
  <input type="tel" placeholder="Telefon">
  <textarea placeholder="Mesajınız"></textarea>
  <button type="submit">Göndər</button>
</div>
<style>
.mc-form { max-width:500px; margin:0 auto; font-family:sans-serif; }
.mc-form input,.mc-form textarea { width:100%; padding:12px; margin:8px 0; border:1px solid #ddd; border-radius:8px; }
.mc-form button { background:#0a2351; color:#fff; padding:14px 28px; border:none; border-radius:8px; cursor:pointer; }
</style>
```

### Product Calculator
```html
<div id="mcCalc" class="mc-calc">
  <h3>Qiymət Kalkulyatoru</h3>
  <select id="calcProduct"></select>
  <input type="number" id="calcQty" min="1" value="1" placeholder="Miqdar">
  <div id="calcResult" class="calc-result"></div>
</div>
```

### Announcement Banner
```html
<div class="mc-banner" style="background:#0a2351;color:#fff;text-align:center;padding:12px;font-family:sans-serif;">
  <strong>🎉 Yeni məhsullar əlavə olundu!</strong>
  <a href="/catalog" style="color:#4da6ff;margin-left:12px;">Kataloqa bax →</a>
</div>
```

## Build Process

### Step 1: Design
- Understand component requirements
- Choose template or build from scratch
- Plan data flow (static vs CMS-connected)

### Step 2: Build HTML/CSS/JS
- Keep total under 15KB
- Scope all CSS with unique prefix (e.g., `.mc-*`)
- Minify if approaching size limit
- Test responsive behavior (mobile-first)

### Step 3: Deploy
- Create embed via API
- Set correct placement (BODY_END for most, HEAD for meta/tracking)
- Publish site after deploy

### Step 4: Verify
- Check embed appears on live site
- Test on mobile viewport
- Verify no CSS conflicts with Wix theme

## Size Management

If component exceeds 15KB:
1. Split data and UI into separate embeds
2. Use global variables for data sharing: `window._mcComponentData = {...}`
3. Minify CSS and JS
4. Remove comments and unnecessary whitespace

## Brand Styles

Use MI CLEAN GROUP brand colors:
- Primary: `#0a2351` (navy)
- Accent: `#1a73e8` (blue)
- Text: `#333333`
- Light BG: `#f5f7fa`
- Border: `#e0e0e0`
- Border radius: `8px`
- Font: system sans-serif stack

## Args

| Arg | Action |
|---|---|
| (no arg) | Interactive component builder |
| `form` | Build a form component |
| `calculator` | Build a calculator widget |
| `banner` | Build an announcement banner |
| `list` | List all current embeds |
| `update:{id}` | Update existing embed |
| `delete:{id}` | Delete embed (with confirmation) |
