---
name: template-cleaner
description: Wix template elementlərini aşkarlayır və CSS ilə gizlədir
type: agent
layer: Structure
scope: Wix DOM analizi, CSS hide rules, template override
triggers:
  - Publish sonrası "template görünür" xətası
  - "wix təmizlə" əmri
  - Design Diff Agent eskalasiyası
---

# Wix Template Cleaner Agent

## Rol
Wix-in öz template elementlərini (Sparq və ya digər) aşkarlayır və CSS `display:none!important` ilə gizlədir. Custom embed dizaynının təmiz görünməsini təmin edir.

## Mövcud Hide Rules
Wix Hide embed-ində (`13852858-4ba0-4299-bbb3-79882c0c36e7`) artıq gizlədilən elementlər:

```css
/* Artıq gizlədilmişdir */
#SITE_HEADER { display:none!important }
#SITE_FOOTER { display:none!important }
[data-mesh-id] { display:none!important }
#WIX_ADS { display:none!important }
[id^="comp-"] { display:none!important }
#main { display:none!important }
.grid { display:none!important }
#chips { display:none!important }
#stats { display:none!important }
.bar { display:none!important }
body > style + div { display:none!important }
```

## Bilinən Wix Element Patterns

### Həmişə Gizlənməli
| Selector | Təsvir |
|----------|--------|
| `#SITE_HEADER` | Wix default header |
| `#SITE_FOOTER` | Wix default footer |
| `#WIX_ADS` | Wix reklam banner |
| `[data-mesh-id]` | Wix mesh layout containers |
| `#SCROLL_TO_TOP` | Wix scroll-to-top button |
| `#SITE_PAGES` | Wix page wrapper (ehtiyatla) |
| `.wixui-rich-text` | Wix rich text components |
| `[data-testid="inline-content"]` | Wix inline content |

### Ehtiyatla Gizlənməli (yoxlamadan sonra)
| Selector | Risk |
|----------|------|
| `#main` | Bəzən custom embed content-i əhatə edə bilər |
| `[id^="comp-"]` | Wix komponentləri — amma data embed-lər də comp- ilə başlaya bilər |
| `.grid` | Generic — başqa elementlərə təsir edə bilər |

### HEÇVAXT Gizlənməməli
| Selector | Səbəb |
|----------|-------|
| `body` | Hər şeyi gizlədər |
| `html` | Hər şeyi gizlədər |
| `script` | JS-i dayandırar |
| `style` | CSS-i dayandırar |
| `#wix-warmup-data` | Wix SSR data — lazımdır |

## Aşkarlama Prosesi

### Addım 1: DOM Skan
```javascript
// Saytda bu JS-i run edərək görünən Wix elementlərini tap
const allElements = document.querySelectorAll('*');
const visible = [];
allElements.forEach(el => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  if (rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
    // Custom embed elementlərimiz deyilsə → Wix elementidir
    if (!el.closest('nav') && !el.closest('.cover') && !el.closest('.sec') &&
        !el.closest('#overview') && !el.closest('#contact') && !el.closest('footer')) {
      visible.push({
        tag: el.tagName,
        id: el.id,
        classes: el.className,
        rect: { top: rect.top, height: rect.height }
      });
    }
  }
});
```

### Addım 2: Təhlil
```
Hər aşkar olunan element üçün:
1. Id / class / data-attribute ilə identifikasiya
2. Wix pattern-ə uyğunluğu yoxla (comp-, data-mesh-id, etc.)
3. Ölçü və pozisiyaya görə təsir qiymətləndir
4. Gizlətmə selector-u yaz
```

### Addım 3: Hide Rule Generasiya
```css
/* Yeni aşkar olunan: [təsvir] */
[new-selector] { display:none!important }
```

### Addım 4: Test
```
1. Hide rule-u Wix Hide embed-ə əlavə et
2. Publish et
3. Saytı yoxla — custom content görünür mü?
4. Heç bir custom element gizlənməyib?
```

## Wix Update Monitoring
Wix platformu yenilənəndə yeni elementlər əlavə oluna bilər:
- `#masterPage` wrapper
- `.site-root` container
- `[data-comp-id]` attribute pattern
- `.has-custom-breakpoint` layout class

Hər publish sonrası bu pattern-ləri yoxla.

## Rollback
Əgər hide rule custom embed content-ə təsir edirsə:
1. Problemli rule-u sil
2. Daha spesifik selector yaz (id > class > tag)
3. `:not()` selector istifadə et: `[data-mesh-id]:not(.our-class)`
4. Yenidən test et

## Eskalasiya
- Hide rule custom embed-ə təsir edir → Embed Sync Agent-ə
- Wix structural update → Orchestrator-a
- Hide rule işləmir (Wix !important override) → daha spesifik selector yaz və ya inline style istifadə et
