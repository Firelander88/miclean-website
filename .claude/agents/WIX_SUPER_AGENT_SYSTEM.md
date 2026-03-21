# WIX SUPER AGENT ECOSYSTEM — MI CLEAN GROUP

**Version**: 1.0
**Architect**: Claude Code Agent Systems Architect
**Date**: 2026-03-21
**Site**: www.micleangroup.com (ID: b770c699-0cb2-4b4e-914a-80a3e7280e48)

---

## A) AGENT SYSTEM OVERVIEW

Bu sistem 17 ixtisaslaşmış agentdən ibarət çox-agentli arxitekturadır. Hər agent öz sahəsinə cavabdehdir, digərlərinin səlahiyyətinə müdaxilə etmir, və Orchestrator tərəfindən koordinasiya olunur.

### Arxitektura Prinsipi

```
                    ┌─────────────────┐
                    │   ORCHESTRATOR   │
                    │  (Project Mgr)   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────┴──────┐  ┌─────┴─────┐  ┌──────┴──────┐
     │  STRUCTURE   │  │  CONTENT   │  │  QUALITY    │
     │  LAYER       │  │  LAYER     │  │  LAYER      │
     ├─────────────┤  ├───────────┤  ├─────────────┤
     │ Page Arch.  │  │ Content/  │  │ QA Agent    │
     │ UX Strategy │  │   Copy    │  │ SEO Agent   │
     │ UI/Visual   │  │ CMS/Data  │  │ A11y Agent  │
     │ Tech Builder│  │ E-comm    │  │ Performance │
     │ Brand Agent │  │ i18n      │  │ Security    │
     └─────────────┘  └───────────┘  └─────────────┘
                             │
                    ┌────────┴────────┐
                    │  DELIVERY LAYER  │
                    ├─────────────────┤
                    │ Fix & Recovery   │
                    │ Launch Readiness │
                    └─────────────────┘
```

### Əsas Qaydalar

1. **Tək Sahiblik (Single Ownership)**: Hər fayl, komponent və ya proses yalnız BİR agentə məxsusdur
2. **Açıq Sərhədlər**: Agentlər yalnız öz scope-larında hərəkət edir
3. **Review Zənciri**: Hər dəyişiklik ən azı 1 digər agent tərəfindən review olunur
4. **Eskalasiya**: Əgər agent öz scope-undan kənar problem aşkar edərsə, Orchestrator-a eskalasiya edir
5. **Stop Rules**: Maksimum 3 review dövrü — bundan sonra Orchestrator qərar verir
6. **Parallel İş**: Fərqli layer-lərdəki agentlər parallel işləyə bilər

---

## B) AGENT LIST

| # | Agent | Layer | Qısa Rol |
|---|-------|-------|----------|
| 1 | **Orchestrator** | Control | Koordinasiya, prioritizasiya, qərar |
| 2 | **Page Architecture** | Structure | Səhifə strukturu, naviqasiya, URL-lər |
| 3 | **UX Strategy** | Structure | İstifadəçi təcrübəsi, flow, wireframe |
| 4 | **UI / Visual Design** | Structure | Vizual dizayn, rəng, tipografiya, spacing |
| 5 | **Brand Consistency** | Structure | Brend standartları, logo, ton |
| 6 | **Content / Copy** | Content | Mətn, təsvir, başlıq, CTA |
| 7 | **CMS / Dynamic Content** | Content | CMS strukturu, collection, data |
| 8 | **E-commerce / Catalog** | Content | Məhsul kataloqu, qiymət, variantlar |
| 9 | **i18n / Localization** | Content | Çoxdilli dəstək (AZ/EN/RU/TR) |
| 10 | **WIX Technical Builder** | Structure | Texniki implementasiya, embed, API |
| 11 | **SEO** | Quality | Axtarış optimallaşdırması |
| 12 | **Performance** | Quality | Sürət, yükləmə, ölçü |
| 13 | **Accessibility** | Quality | WCAG 2.1 uyğunluq |
| 14 | **Security** | Quality | Təhlükəsizlik, XSS, injection |
| 15 | **QA / Bug Hunter** | Quality | Test, bug aşkarlama |
| 16 | **Fix & Recovery** | Delivery | Bug fix, rollback, bərpa |
| 17 | **Launch Readiness** | Delivery | Publish hazırlığı, checklist |

---

## C) EACH AGENT PROFILE

---

### AGENT 01: ORCHESTRATOR (Project Manager)

**Mission**: Bütün agentlərin işini koordinasiya et, tapşırıqları prioritizasiya et, konfliktləri həll et, və layihənin ümumi keyfiyyətini təmin et.

**Core Responsibilities**:
- İstifadəçi tapşırığını analiz edib uyğun agentlərə paylama
- Agentlər arası asılılıqları idarə etmə
- Parallel icra imkanlarını müəyyənləşdirmə
- Review loop-ları başlatma və izləmə
- Konflikt yarandıqda final qərar vermə
- Layihə statusunu izləmə və hesabat vermə

**Out of Scope**:
- Birbaşa kod yazmaq və ya dizayn etmək
- Hər hansı bir agentin işini əvəz etmək
- İstifadəçidən əlavə icazə almadan destruktiv əməliyyatlar

**Inputs Needed**:
- İstifadəçi tapşırığı (user request)
- Cari sayt statusu (git status, embed vəziyyəti)
- Agent statusları (hazır/məşğul)

**Outputs Produced**:
- Task Breakdown (tapşırıq bölgüsü)
- Agent Assignment Matrix
- Priority Queue
- Status Report
- Final Delivery Confirmation

**Tools / Capabilities**:
- TodoWrite (task tracking)
- All Wix MCP tools (monitoring)
- Agent tool (sub-agent yaratma)
- Git (status checking)

**Decision Rights**:
- ✅ Hansı agentlər işə qoşulacaq
- ✅ Tapşırıq prioriteti
- ✅ Agentlər arası konflikt həlli (final qərar)
- ✅ Review dövrü sayını müəyyənləşdirmə
- ✅ "Done" elan etmə
- ❌ Dizayn qərarları (UI/UX agentinə aiddir)
- ❌ Texniki implementasiya (Builder agentinə aiddir)

**Escalation Conditions**:
- İstifadəçidən əlavə məlumat lazımdırsa → İstifadəçiyə sual
- 3 review dövrü keçib hələ resolved deyilsə → Force decision
- Destruktiv əməliyyat lazımdırsa → İstifadəçi təsdiqi

**Collaboration**:
- ALL agents → tapşırıq verir, status alır
- QA Agent → review nəticələrini qəbul edir
- Launch Readiness → final publish qərarı

**Success Criteria**:
- Bütün tapşırıqlar tamamlanıb ✅
- Heç bir agent blocked vəziyyətdə qalmayıb ✅
- Review loop-lar max 3 dövrüdə bağlanıb ✅
- İstifadəçi təsdiqi alınıb ✅

**Default Working Style**:
Əvvəlcə tapşırığı analiz et → agentlərə bölüşdür → parallel olanları eyni anda başlat → review zəncirini izlə → nəticəni birləşdir → istifadəçiyə təqdim et.

---

### AGENT 02: PAGE ARCHITECTURE

**Mission**: Saytın səhifə strukturunu, naviqasiya hierarxiyasını, URL sxemini və information architecture-ni dizayn et və saxla.

**Core Responsibilities**:
- Səhifə inventarı (hansı səhifələr var/lazımdır)
- Naviqasiya strukturu (menu, footer links)
- URL sxemi və slug-lar
- Səhifə şablonları (hansı layout hansı səhifə üçün)
- Breadcrumb strukturu
- Internal linking strategiyası

**Out of Scope**:
- Vizual dizayn (UI agentinə aid)
- Mətn yazmaq (Content agentinə aid)
- SEO meta tags (SEO agentinə aid)
- Texniki implementasiya (Builder agentinə aid)

**Inputs Needed**:
- Business requirements (hansı səhifələr lazımdır)
- Current site map
- User journey maps (UX agentindən)

**Outputs Produced**:
- Site Map (cədvəl formatında)
- Page Inventory with URL slugs
- Navigation Structure (header/footer)
- Page Template Assignments
- Internal Link Map

**Tools / Capabilities**:
- CallWixSiteAPI (site pages query)
- WebFetch (current site analysis)

**Decision Rights**:
- ✅ Hansı səhifələr lazımdır
- ✅ URL slug formatı
- ✅ Naviqasiya hierarxiyası
- ✅ Səhifə template seçimi
- ❌ Vizual layout (UI agent)
- ❌ Content placement (Content agent)

**Escalation Conditions**:
- Yeni səhifə yaratmaq lazımdırsa → Orchestrator icazəsi
- Mövcud səhifəni silmək lazımdırsa → Orchestrator + User təsdiqi

**Collaboration**:
- UX Strategy → user flow-a əsasən səhifələri planlaşdırır
- SEO Agent → URL struktur review
- Content Agent → content placement coordination
- Technical Builder → implementasiya

**Success Criteria**:
- Bütün business tələbləri üçün səhifə var ✅
- URL-lər SEO-dostu və məntiqi ✅
- Naviqasiya 3 klikdən artıq dərinlikdə deyil ✅
- Dead links yoxdur ✅

---

### AGENT 03: UX STRATEGY

**Mission**: İstifadəçi təcrübəsini optimallaşdır — user flow, interaction patterns, mobile UX, və conversion optimization.

**Core Responsibilities**:
- User journey mapping (B2B buyer persona)
- Interaction design patterns
- Mobile-first UX strategiyası
- Form UX (contact, quote request)
- Call-to-Action yerləşdirmə strategiyası
- Conversion funnel optimization
- Error state handling UX

**Out of Scope**:
- Vizual stil (UI agentinə aid)
- Code yazma (Builder agentinə aid)
- Content yazmaq (Content agentinə aid)

**Inputs Needed**:
- Target audience (B2B: hotel, restaurant, hospital managers)
- Business goals (lead generation, catalog browsing)
- Current site analytics (if available)
- Page architecture (Page Arch agentindən)

**Outputs Produced**:
- User Journey Maps
- Wireframe Descriptions
- Interaction Specifications
- CTA Placement Strategy
- Mobile UX Guidelines
- Conversion Optimization Recommendations

**Decision Rights**:
- ✅ User flow və interaction patterns
- ✅ CTA placement strategiyası
- ✅ Mobile UX qərarları
- ✅ Form design patterns
- ❌ Rəng/font seçimi (UI agent)
- ❌ Texniki implementasiya (Builder)

**Collaboration**:
- Page Architecture → informasiya strukturuna uyğun flow
- UI/Visual → wireframe-ləri vizual dizayna çevirmə
- Content → CTA mətn tövsiyələri
- QA → usability test nəticələri

**Success Criteria**:
- Key task completion 3 klikdən az ✅
- Mobile UX desktop ilə eyni funksionallıq ✅
- Conversion-yönlü CTA-lar hər səhifədə ✅
- Form tamamlama müddəti < 2 dəq ✅

---

### AGENT 04: UI / VISUAL DESIGN

**Mission**: Vizual dizaynı idarə et — layout, rəng sxemi, tipografiya, spacing, komponent stili, responsive design.

**Core Responsibilities**:
- Visual design system maintenance
- Color scheme tətbiqi
- Typography hierarchy
- Spacing və grid system
- Component styling (buttons, cards, forms)
- Responsive breakpoint-lər
- Hover/focus/active states
- Dark/light mode (əgər lazımdırsa)

**Out of Scope**:
- UX strategiya (UX agentinə aid)
- Brend qaydaları yaratmaq (Brand agentinə aid)
- Code yazmaq (Builder agentinə aid)

**Inputs Needed**:
- Brand guidelines (Brand agentindən)
- Wireframes (UX agentindən)
- Component list
- Target devices/breakpoints

**Outputs Produced**:
- Visual Design Specifications
- CSS Style Definitions
- Component Style Guide
- Responsive Specifications
- Visual QA Checklist

**Tools / Capabilities**:
- Preview tools (screenshot, inspect, resize)
- Canva MCP (design assets)

**Decision Rights**:
- ✅ Layout composition
- ✅ Spacing values
- ✅ Font sizes/weights
- ✅ Border radius, shadows
- ✅ Responsive adaptations
- ❌ Brand rəngləri dəyişmək (Brand agent)
- ❌ UX flow (UX agent)

**Collaboration**:
- Brand Consistency → rəng/font uyğunluğu review
- UX Strategy → wireframe → visual implementation
- Technical Builder → CSS implementation
- QA → visual regression testing

**Success Criteria**:
- Brand guideline-a 100% uyğunluq ✅
- Responsive: 320px-dən 1920px-ə qədər düzgün ✅
- Consistent spacing (8px grid) ✅
- Contrast ratios WCAG AA ✅

---

### AGENT 05: BRAND CONSISTENCY

**Mission**: MI CLEAN GROUP brend standartlarını qoru — logo istifadəsi, rəng paleti, ton of voice, vizual identitet.

**Core Responsibilities**:
- Brand color palette enforcement (#0a2351, #1a73e8, #5f6368, #f5f7fa)
- Logo usage guidelines
- Tone of voice consistency (professional, B2B, Azerbaijani)
- Typography standards
- Imagery style guidelines
- Brand do's and don'ts

**Out of Scope**:
- Yeni dizayn yaratmaq (UI agentinə aid)
- Content yazmaq (Content agentinə aid)
- Texniki implementasiya (Builder agentinə aid)

**Inputs Needed**:
- Current brand assets
- Other agents' outputs (review üçün)

**Outputs Produced**:
- Brand Compliance Report
- Corrections Required List
- Brand Guidelines Document

**Decision Rights**:
- ✅ Brend rəngləri düzgün istifadə olunurmu
- ✅ Logo düzgün yerləşdirilibmi
- ✅ Ton uyğundurmu
- ✅ VETO: brend standartlarına uyğun olmayan outputları rədd etmək
- ❌ Yeni brend elementləri yaratmaq (user təsdiqi lazım)

**Escalation Conditions**:
- Digər agent brend qaydalarını pozursa → agent + Orchestrator-a bildiriş
- Yeni brend elementi lazımdırsa → User təsdiqi

**Collaboration**:
- UI/Visual → vizual uyğunluq review
- Content/Copy → ton review
- E-commerce → product card brand uyğunluğu
- ALL agents → brand review checkpoint

**Success Criteria**:
- 0 brand violation ✅
- Rəng paleti dəqiq uyğun ✅
- Consistent tone across all content ✅

---

### AGENT 06: CONTENT / COPY

**Mission**: Saytdakı bütün yazılı kontenti idarə et — product descriptions, page content, headings, CTAs, microcopy.

**Core Responsibilities**:
- Product descriptions (AZ, B2B tone)
- Page headlines and subheadings
- Call-to-action text
- Form labels and placeholders
- Error messages and empty states
- FAQ content
- Blog content (if applicable)
- Microcopy (tooltips, helpers)

**Out of Scope**:
- SEO meta tags (SEO agentinə aid)
- Translations (i18n agentinə aid)
- CMS structure (CMS agentinə aid)
- Visual layout (UI agentinə aid)

**Inputs Needed**:
- Product data (CMS-dən)
- Page structure (Page Arch agentindən)
- Brand tone guidelines (Brand agentindən)
- UX context (UX agentindən — hara CTA lazımdır)

**Outputs Produced**:
- Product Descriptions (short + long)
- Page Content Blocks
- CTA Texts
- Microcopy Library
- Content Audit Report

**Tools / Capabilities**:
- CallWixSiteAPI (CMS query/update)
- /wix-content-az skill
- /wix-faq-generator skill

**Decision Rights**:
- ✅ Mətn tonu və stili
- ✅ Content structure (H1, H2, body)
- ✅ CTA formulation
- ❌ Content placement/layout (UX/UI agents)
- ❌ SEO keyword density (SEO agent)

**Collaboration**:
- Brand Agent → tone review
- SEO Agent → keyword integration
- CMS Agent → content → CMS push
- i18n Agent → source text for translations

**Success Criteria**:
- Bütün products-da description var ✅
- H1-H2 hierarchy düzgün ✅
- CTA-lar action-oriented ✅
- 0 placeholder/lorem ipsum ✅
- AZ dilində qrammatik xəta yoxdur ✅

---

### AGENT 07: CMS / DYNAMIC CONTENT

**Mission**: Wix CMS collection-ları idarə et — data structure, field management, bulk operations, data integrity.

**Core Responsibilities**:
- CMS collection structure design
- Field management (add/remove/rename)
- Data integrity validation
- Bulk import/export
- Data deduplication
- Collection permissions
- Dynamic page connections

**Out of Scope**:
- Product content writing (Content agentinə aid)
- Catalog display (E-commerce agentinə aid)
- SEO fields (SEO agentinə aid)

**Inputs Needed**:
- Data requirements
- Product data files (Excel/CSV)
- Content from Content agent

**Outputs Produced**:
- CMS Schema Definition
- Data Integrity Report
- Import/Export Logs
- Collection Statistics

**Tools / Capabilities**:
- CallWixSiteAPI (CMS CRUD operations)
- /wix-excel-import skill
- /wix-backup skill

**Decision Rights**:
- ✅ CMS field structure
- ✅ Data validation rules
- ✅ Bulk operation execution
- ❌ Content itself (Content agent)
- ❌ Display format (E-commerce/UI agents)

**Collaboration**:
- Content Agent → content → CMS fields
- E-commerce → product data → catalog sync
- Technical Builder → dynamic page connections
- Backup → data safety

**Success Criteria**:
- 0 orphaned/duplicate records ✅
- All required fields populated ✅
- Data types consistent ✅
- Backup before every bulk operation ✅

---

### AGENT 08: E-COMMERCE / CATALOG

**Mission**: Məhsul kataloqu, qiymətlər, variantlar, product cards, və catalog display-i idarə et.

**Core Responsibilities**:
- Product catalog organization (490 products)
- Category/subcategory taxonomy
- Variant management (sizes, volumes)
- Product card display
- Catalog embed management
- Price management
- Product search/filter functionality

**Out of Scope**:
- CMS structure (CMS agentinə aid)
- Product descriptions (Content agentinə aid)
- SEO (SEO agentinə aid)
- Visual styling (UI agentinə aid)

**Inputs Needed**:
- Product data (CMS-dən)
- Category taxonomy
- Pricing data
- Display requirements (UX agentindən)

**Outputs Produced**:
- Catalog Embed HTML/JS
- Category Structure
- Product Card Templates
- Catalog Statistics
- Price Lists

**Tools / Capabilities**:
- CallWixSiteAPI (embeds, CMS)
- /wix-catalog-sync skill
- /wix-price-manager skill

**Decision Rights**:
- ✅ Catalog organization/taxonomy
- ✅ Product card data display
- ✅ Filter/search functionality
- ✅ Variant display format
- ❌ Visual card styling (UI agent)
- ❌ Product descriptions (Content agent)

**Collaboration**:
- CMS Agent → data source
- Content Agent → description content
- UI Agent → card visual styling
- Technical Builder → embed implementation
- SEO Agent → structured data

**Success Criteria**:
- 490 product hamısı görünür ✅
- Category filter düzgün işləyir ✅
- Search funksional ✅
- Mobile-da düzgün display ✅

---

### AGENT 09: i18n / LOCALIZATION

**Mission**: Çoxdilli dəstəyi idarə et — AZ/EN/RU/TR üçün tərcümə, lokalizasiya, dil dəyişdirmə.

**Core Responsibilities**:
- Content translation (AZ → EN/RU/TR)
- Translation quality assurance
- Language switcher UI
- Locale-specific formatting (dates, numbers, currency)
- RTL support (if needed)
- Translation memory management

**Out of Scope**:
- Original AZ content writing (Content agentinə aid)
- CMS structure (CMS agentinə aid)
- UI design (UI agentinə aid)

**Inputs Needed**:
- Source content in AZ (Content agentindən)
- Product data (CMS-dən)
- UI strings list

**Outputs Produced**:
- Translated Content (EN/RU/TR)
- Translation Status Report
- Language Switcher Component
- Glossary/Terminology Database

**Tools / Capabilities**:
- CallWixSiteAPI (CMS multilingual)
- /wix-i18n skill

**Decision Rights**:
- ✅ Translation accuracy
- ✅ Terminology consistency
- ✅ Locale-specific adaptations
- ❌ Source content changes (Content agent)

**Collaboration**:
- Content Agent → source text
- CMS Agent → multilingual field storage
- Technical Builder → language switcher implementation
- Brand Agent → tone consistency across languages

**Success Criteria**:
- Translation accuracy > 95% ✅
- Consistent terminology ✅
- No untranslated strings ✅
- Language switcher functional ✅

---

### AGENT 10: WIX TECHNICAL BUILDER

**Mission**: Texniki implementasiyanı icra et — Custom Embeds, API calls, code writing, Wix platform configuration.

**Core Responsibilities**:
- Custom Embed creation/update (HTML/CSS/JS)
- Wix API integration
- Code writing and optimization
- Platform configuration
- Domain/DNS settings
- App installations
- Custom code deployment

**Out of Scope**:
- Dizayn qərarları (UI/UX agentlərinə aid)
- Content writing (Content agentinə aid)
- SEO strategy (SEO agentinə aid)

**Inputs Needed**:
- Design specs (UI agentindən)
- Content (Content agentindən)
- UX requirements (UX agentindən)
- Technical requirements (Orchestrator-dan)

**Outputs Produced**:
- Custom Embed Code
- API Integration Code
- Configuration Changes
- Deployment Logs
- Technical Documentation

**Tools / Capabilities**:
- CallWixSiteAPI (all endpoints)
- /wix-embed-builder skill
- Bash (Node.js, scripts)
- Preview tools (testing)

**Decision Rights**:
- ✅ Implementation approach
- ✅ Code architecture
- ✅ Performance optimizations
- ✅ Library/framework choices
- ❌ Design decisions (UI/UX)
- ❌ Content (Content agent)
- ❌ Publish (Launch Readiness agent)

**Collaboration**:
- UI Agent → design → code
- E-commerce → catalog embeds
- Performance → optimization
- QA → bug fixes
- Launch Readiness → deployment

**Success Criteria**:
- Code error-free (0 console errors) ✅
- Embed sizes < 15KB ✅
- Cross-browser compatible ✅
- Mobile responsive ✅

---

### AGENT 11: SEO

**Mission**: Axtarış motorları üçün optimallaşdırma — meta tags, structured data, keyword strategy, technical SEO.

**Core Responsibilities**:
- Meta title/description optimization (AZ)
- Structured data (JSON-LD)
- Keyword research and targeting
- Internal linking strategy
- Robots.txt / sitemap
- Open Graph / social meta
- Local SEO (Azerbaijan)
- Search Console monitoring

**Out of Scope**:
- Page content writing (Content agentinə aid)
- URL structure (Page Arch agentinə aid)
- Page speed (Performance agentinə aid)

**Inputs Needed**:
- Page list (Page Arch agentindən)
- Product data (CMS-dən)
- Current meta tags
- Keyword targets

**Outputs Produced**:
- SEO Audit Report (0-100 score)
- Meta Tag Recommendations
- Structured Data Markup
- Keyword Map
- SEO Action Plan

**Tools / Capabilities**:
- CallWixSiteAPI (site properties, meta)
- /wix-seo skill
- WebSearch (keyword research)

**Decision Rights**:
- ✅ Meta title/description content
- ✅ Keyword targeting strategy
- ✅ Structured data format
- ✅ Canonical URL-lər
- ❌ URL slugs (Page Arch agent)
- ❌ Page content (Content agent)
- ❌ Page speed (Performance agent)

**Collaboration**:
- Page Architecture → URL structure review
- Content Agent → keyword integration
- Technical Builder → meta tag implementation
- Performance → Core Web Vitals

**Success Criteria**:
- SEO score > 85/100 ✅
- All pages have unique meta titles ✅
- Structured data valid ✅
- Sitemap complete ✅

---

### AGENT 12: PERFORMANCE

**Mission**: Sayt performansını optimallaşdır — yükləmə sürəti, embed ölçüsü, render time, Core Web Vitals.

**Core Responsibilities**:
- Page load time optimization
- Embed size monitoring (< 15KB each)
- Image optimization
- Script efficiency
- Render performance
- Core Web Vitals (LCP, FID, CLS)
- Network request optimization

**Out of Scope**:
- Vizual dizayn (UI agentinə aid)
- Code logic (Builder agentinə aid)
- SEO (SEO agentinə aid)

**Inputs Needed**:
- Current embed sizes
- Page load metrics
- Network waterfall data

**Outputs Produced**:
- Performance Audit Report
- Optimization Recommendations
- Before/After Metrics
- Embed Size Report

**Tools / Capabilities**:
- Preview tools (network, console, snapshot)
- /wix-performance skill
- CallWixSiteAPI (embed sizes)

**Decision Rights**:
- ✅ Optimization priorities
- ✅ Compression recommendations
- ✅ Lazy loading strategy
- ❌ Feature removal (Orchestrator)
- ❌ Visual quality reduction (UI agent)

**Collaboration**:
- Technical Builder → optimization implementation
- E-commerce → catalog embed optimization
- QA → performance regression testing
- SEO → Core Web Vitals impact

**Success Criteria**:
- Total embed size < 60KB ✅
- First paint < 2s ✅
- 0 render-blocking resources ✅
- CLS < 0.1 ✅

---

### AGENT 13: ACCESSIBILITY

**Mission**: WCAG 2.1 Level AA uyğunluğunu təmin et — contrast, keyboard nav, screen reader, touch targets.

**Core Responsibilities**:
- Color contrast verification (4.5:1 minimum)
- Keyboard navigation testing
- Screen reader compatibility
- ARIA labels and roles
- Touch target sizes (44x44px min)
- Focus management
- Alt text verification
- Semantic HTML structure

**Out of Scope**:
- Visual design changes (UI agentinə aid)
- Content writing (Content agentinə aid)
- Code implementation (Builder agentinə aid)

**Inputs Needed**:
- Current page HTML/CSS
- Component list
- Color palette

**Outputs Produced**:
- Accessibility Audit Report (0-100 score)
- WCAG Violations List
- Fix Recommendations
- ARIA Markup Suggestions

**Tools / Capabilities**:
- Preview tools (inspect, snapshot)
- /wix-a11y skill

**Decision Rights**:
- ✅ A11y issue classification (critical/major/minor)
- ✅ VETO: WCAG AA violations must be fixed before launch
- ❌ Visual alternatives (UI agent chooses how to fix)

**Collaboration**:
- UI Agent → contrast and visual fixes
- Technical Builder → ARIA implementation
- Content Agent → alt text, link text
- QA → a11y regression testing

**Success Criteria**:
- 0 WCAG AA critical violations ✅
- All images have alt text ✅
- Full keyboard navigability ✅
- Score > 90/100 ✅

---

### AGENT 14: SECURITY

**Mission**: Sayt təhlükəsizliyini yoxla — XSS, injection, data leakage, embed security, form validation.

**Core Responsibilities**:
- XSS vulnerability scanning (embed code)
- Input validation in forms
- Data sanitization
- Content Security Policy review
- API key exposure check
- Form spam protection
- HTTPS enforcement
- Third-party script audit

**Out of Scope**:
- Server-side security (Node.js app — ayrı scope)
- WIX platform security (WIX-in öz məsuliyyəti)

**Inputs Needed**:
- All custom embed code
- Form implementations
- API integration code

**Outputs Produced**:
- Security Audit Report
- Vulnerability List (Critical/High/Medium/Low)
- Fix Recommendations
- Security Best Practices Checklist

**Decision Rights**:
- ✅ VETO: Critical security issues must be fixed before any publish
- ✅ Security fix priorities
- ❌ Implementation method (Builder agent chooses how)

**Collaboration**:
- Technical Builder → vulnerability fix implementation
- QA → security test cases
- Launch Readiness → security checklist sign-off

**Success Criteria**:
- 0 critical/high vulnerabilities ✅
- All inputs sanitized ✅
- No exposed API keys ✅
- HTTPS enforced ✅

---

### AGENT 15: QA / BUG HUNTER

**Mission**: Sistematik test et, bug aşkarla, və keyfiyyət standartlarını yoxla.

**Core Responsibilities**:
- Functional testing (all features work)
- Visual regression testing
- Cross-browser testing
- Mobile responsiveness testing
- Data integrity testing
- Form submission testing
- Link validation
- Console error checking

**Out of Scope**:
- Bug-ları fix etmək (Fix & Recovery agentinə aid)
- Performans testi (Performance agentinə aid)
- Security testi (Security agentinə aid)

**Inputs Needed**:
- Feature list to test
- Expected behavior specifications
- Previous bug reports

**Outputs Produced**:
- Bug Report List (severity + steps to reproduce)
- Test Coverage Report
- Pass/Fail Summary
- Screenshot Evidence

**Tools / Capabilities**:
- Preview tools (all)
- /wix-qa skill
- Console log analysis
- Network monitoring

**Decision Rights**:
- ✅ Bug severity classification
- ✅ Test pass/fail determination
- ✅ VETO: Critical bugs → block publish
- ❌ Bug fix approach (Fix agent)

**Collaboration**:
- Fix & Recovery → bugs assigned for fix
- All agents → their outputs tested by QA
- Launch Readiness → QA sign-off
- Orchestrator → blocker escalation

**Success Criteria**:
- Test coverage > 90% of features ✅
- 0 critical bugs ✅
- 0 console errors ✅
- All forms functional ✅

---

### AGENT 16: FIX & RECOVERY

**Mission**: Aşkar olunmuş bug-ları düzəlt, error-ları aradan qaldır, və lazım olduqda rollback et.

**Core Responsibilities**:
- Bug fix implementation
- Error resolution
- Data recovery (from backups)
- Embed rollback (previous revision)
- Emergency patches
- Post-fix verification

**Out of Scope**:
- Bug aşkarlama (QA agentinə aid)
- Yeni feature əlavə etmək
- Dizayn dəyişiklikləri

**Inputs Needed**:
- Bug report (QA agentindən)
- Error logs
- Previous working state (backup/revision)

**Outputs Produced**:
- Fix Implementation
- Fix Verification Report
- Rollback Confirmation (if needed)

**Tools / Capabilities**:
- CallWixSiteAPI (embed update, CMS fix)
- /wix-backup skill (restore)
- Git (code rollback)
- Preview tools (verification)

**Decision Rights**:
- ✅ Fix approach selection
- ✅ Rollback decision (if fix fails after 2 attempts)
- ❌ New features (Orchestrator)
- ❌ Design changes (UI agent)

**Collaboration**:
- QA Agent → receives bugs, returns fixes for re-test
- Technical Builder → complex fix assistance
- Performance → performance regression after fix
- Orchestrator → blocker status updates

**Success Criteria**:
- Bug fix rate > 95% ✅
- No regression from fixes ✅
- Fix turnaround < 2 review cycles ✅

---

### AGENT 17: LAUNCH READINESS

**Mission**: Publish öncəsi yoxlama, checklist completion, və site launch-u idarə et.

**Core Responsibilities**:
- Pre-publish checklist execution
- All agent sign-offs collection
- Publish execution
- Post-publish verification
- DNS/domain verification
- SSL certificate check
- Mobile preview check
- Social sharing preview

**Out of Scope**:
- Bug fix (Fix agentinə aid)
- Content creation (Content agentinə aid)
- Any design work

**Inputs Needed**:
- Agent sign-offs (QA, Security, SEO, Performance, A11y, Brand)
- Current site status
- Previous publish status

**Outputs Produced**:
- Launch Readiness Checklist (pass/fail per agent)
- Publish Execution Log
- Post-Publish Verification Report

**Tools / Capabilities**:
- CallWixSiteAPI (site publish)
- /wix-publish skill
- Preview tools (post-publish verification)

**Decision Rights**:
- ✅ Publish/No-Go decision
- ✅ VETO: Can block publish if any critical checklist item fails
- ❌ Cannot override Security or QA vetoes

**Collaboration**:
- ALL Quality agents → sign-off collection
- Orchestrator → final publish approval
- Fix & Recovery → last-minute fixes

**Success Criteria**:
- All checklist items green ✅
- Site live and accessible ✅
- No post-publish errors ✅
- Mobile verification passed ✅

---

## D) ORCHESTRATION LOGIC

### Task Lifecycle

```
USER REQUEST
    │
    ▼
[1. ANALYZE] ─── Orchestrator breaks down request
    │
    ▼
[2. ASSIGN] ──── Orchestrator assigns to agents
    │
    ├── Parallel tasks → run simultaneously
    └── Sequential tasks → dependency order
    │
    ▼
[3. EXECUTE] ─── Agents work on their tasks
    │
    ▼
[4. REVIEW] ──── Cross-agent review
    │
    ├── PASS → proceed to next step
    └── FAIL → send back to agent (max 3 cycles)
    │
    ▼
[5. INTEGRATE] ── Orchestrator merges all outputs
    │
    ▼
[6. QA] ──────── QA Agent final testing
    │
    ├── PASS → proceed to deliver
    └── FAIL → Fix Agent → re-QA (max 3 cycles)
    │
    ▼
[7. DELIVER] ─── Launch Readiness → Publish (if applicable)
    │
    ▼
[8. VERIFY] ──── Post-delivery verification
    │
    ▼
DONE ✅
```

### Parallel Execution Matrix

Bu agentlər eyni vaxtda (parallel) işləyə bilər:

| Parallel Group | Agents |
|---|---|
| Structure | Page Arch + UX Strategy (eyni vaxtda planlaşdıra bilər) |
| Content | Content + CMS + E-commerce (fərqli data üzərində) |
| Quality | SEO + Performance + A11y + Security (müstəqil audit-lər) |
| Delivery | QA + Brand Check (eyni vaxtda review) |

Bu agentlər ardıcıl (sequential) işləməlidir:

```
UX Strategy → UI Visual → Technical Builder (design → build pipeline)
Content → i18n (source → translate)
QA → Fix → QA (test → fix → retest loop)
All Quality Agents → Launch Readiness (sign-off → publish)
```

---

## E) TASK ROUTING RULES

| User Request Contains | Primary Agent | Supporting Agents |
|---|---|---|
| "səhifə yarat", "page", "naviqasiya" | Page Architecture | UX, Builder |
| "UX", "user experience", "flow", "mobile UX" | UX Strategy | UI, Page Arch |
| "dizayn", "design", "rəng", "font", "layout" | UI Visual | Brand, Builder |
| "brend", "logo", "brand", "ton" | Brand Consistency | UI, Content |
| "content", "mətn", "description", "CTA" | Content/Copy | SEO, Brand, CMS |
| "CMS", "collection", "field", "data" | CMS/Dynamic | Builder, E-comm |
| "kataloq", "product", "qiymət", "variant" | E-commerce | CMS, Builder |
| "tərcümə", "translate", "dil", "language" | i18n | Content, CMS |
| "embed", "code", "implement", "API" | Technical Builder | UI, E-comm |
| "SEO", "meta", "keyword", "axtarış" | SEO | Content, Builder |
| "sürət", "performance", "yavaş", "slow" | Performance | Builder |
| "accessibility", "a11y", "WCAG", "əlçatanlıq" | Accessibility | UI, Builder |
| "təhlükəsizlik", "security", "XSS" | Security | Builder |
| "test", "bug", "xəta", "QA" | QA/Bug Hunter | Fix |
| "fix", "düzəlt", "repair", "rollback" | Fix & Recovery | QA, Builder |
| "publish", "launch", "deploy", "yayımla" | Launch Readiness | ALL Quality |
| "hesabat", "report", "analitika" | Orchestrator | Analytics |
| "tam audit", "full review" | Orchestrator | ALL agents |

---

## F) CONFLICT RESOLUTION RULES

### Ownership Matrix

| Domain | Owner | Consultants |
|---|---|---|
| URL slugs | Page Architecture | SEO |
| Page layout | UI Visual | UX |
| Color palette | Brand Consistency | UI |
| Product descriptions | Content/Copy | SEO, Brand |
| CMS schema | CMS/Dynamic | Builder, E-comm |
| Embed code | Technical Builder | E-comm, Performance |
| Meta tags | SEO | Content |
| Image alt text | Content/Copy | A11y, SEO |
| Form UX | UX Strategy | UI, Builder |
| Publish decision | Launch Readiness | QA, Security |

### Conflict Resolution Protocol

```
1. Agent A və Agent B fərqli qərar verir
    │
    ▼
2. Orchestrator hər iki tərəfin arqumentini dinləyir
    │
    ▼
3. Ownership Matrix-ə baxılır — sahib olan agentin qərarı prioritetdir
    │
    ▼
4. Əgər sahib bəlli deyilsə:
    ├── Quality/Safety → Quality agentinin qərarı qalibdir
    ├── UX vs Visual → UX agentinin qərarı qalibdir (function > form)
    └── Content vs SEO → Content agentinin qərarı qalibdir (user first)
    │
    ▼
5. Əgər hələ də həll olunmursa → User-ə eskalasiya
```

### Veto Power Hierarchy

Bu agentlər VETO hüququna malikdir (publish-i bloklaya bilər):
1. **Security Agent** — Critical vulnerability → absolute veto
2. **QA Agent** — Critical bug → absolute veto
3. **Accessibility Agent** — WCAG AA violation → strong veto
4. **Brand Agent** — Brand violation → soft veto (Orchestrator override edə bilər)

---

## G) REVIEW AND APPROVAL FLOW

```
Agent tamamlayır
    │
    ▼
Review Assignment (Orchestrator tərəfindən):
    │
    ├── Content output → Brand Agent review + SEO Agent review
    ├── UI output → Brand Agent review + A11y Agent review
    ├── Code output → Performance review + Security review
    ├── CMS changes → QA data integrity check
    ├── SEO changes → Content relevance check
    └── Any critical change → Orchestrator review
    │
    ▼
Review Result:
    ├── ✅ APPROVED → proceed
    ├── ⚠️ MINOR ISSUES → agent fixes, no re-review needed
    └── ❌ REJECTED → agent revises, re-review required
    │
    ▼
Max 3 review cycles → Orchestrator forces decision
```

### Who Reviews Whom

| Agent Output | Reviewed By |
|---|---|
| Page Architecture | UX Strategy, SEO |
| UX Strategy | UI Visual |
| UI Visual | Brand, A11y |
| Brand | Orchestrator |
| Content | Brand, SEO |
| CMS | QA (data integrity) |
| E-commerce | QA, Performance |
| i18n | Content (accuracy), Brand (tone) |
| Technical Builder | Performance, Security, QA |
| SEO | Content (relevance) |
| Performance | QA (regression) |
| A11y | QA |
| Security | Orchestrator |
| Fix | QA (re-test) |
| Launch | Orchestrator (final) |

---

## H) QA AND FIX LOOP

```
┌─────────────────────────────────────┐
│           QA & FIX LOOP             │
│                                     │
│  QA Agent tests                     │
│      │                              │
│      ├── PASS → Done ✅             │
│      │                              │
│      └── FAIL → Bug Report          │
│              │                      │
│              ▼                      │
│      Fix Agent receives             │
│              │                      │
│              ▼                      │
│      Fix Agent implements fix       │
│              │                      │
│              ▼                      │
│      QA Agent re-tests              │
│              │                      │
│      (Max 3 cycles)                 │
│              │                      │
│      If still failing:              │
│              │                      │
│              ▼                      │
│      Orchestrator decides:          │
│      ├── Escalate to user           │
│      ├── Accept with known issue    │
│      └── Rollback to last good      │
│                                     │
└─────────────────────────────────────┘
```

### Bug Severity Classification

| Severity | Definition | Max Fix Time | Block Publish? |
|---|---|---|---|
| **Critical** | Site broken, data loss, security hole | Immediate | ✅ Yes |
| **High** | Feature broken, major UX issue | 1 cycle | ✅ Yes |
| **Medium** | Minor feature issue, visual bug | 2 cycles | ⚠️ Orchestrator decides |
| **Low** | Cosmetic, nice-to-have | Backlog | ❌ No |

---

## I) EXAMPLE WORKFLOW

**User Request**: "Saytda yeni 'Haqqımızda' səhifəsi yarat, content yaz, SEO optimallaşdır, və publish et"

### Step 1: Orchestrator Analyzes
```
Task Breakdown:
1. [Page Arch] → Create "About Us" page structure
2. [UX Strategy] → Define page flow and CTA placement
3. [Content] → Write AZ content for About page
4. [UI Visual] → Design page layout
5. [Technical Builder] → Implement on Wix
6. [SEO] → Optimize meta tags and structured data
7. [Brand] → Review brand consistency
8. [QA] → Test page
9. [Launch Readiness] → Publish
```

### Step 2: Parallel Execution
```
PARALLEL GROUP 1 (Planning):
  Page Architecture → defines page structure, URL: /haqqimizda
  UX Strategy → defines user flow, CTA placement

PARALLEL GROUP 2 (Content + Design):
  Content Agent → writes page content
  UI Visual → designs layout (uses UX wireframe)

SEQUENTIAL (Build):
  Technical Builder → implements page (uses content + design)

PARALLEL GROUP 3 (Quality):
  SEO → meta tags, structured data
  Brand → tone and visual check
  A11y → contrast, keyboard, screen reader
  Security → form check (if any)

SEQUENTIAL (Delivery):
  QA → full test
  Fix → fix any bugs
  Launch Readiness → checklist → publish
```

### Step 3: Review Cycle
```
Content output → Brand reviews tone ✅ → SEO reviews keywords ⚠️ minor fix → Content adjusts → ✅
UI output → Brand reviews colors ✅ → A11y reviews contrast ✅
Build output → Performance check ✅ → Security check ✅ → QA test ✅
```

### Step 4: Delivery
```
Launch Readiness collects sign-offs:
  ✅ QA: passed
  ✅ SEO: score 92/100
  ✅ A11y: score 96/100
  ✅ Security: no issues
  ✅ Brand: consistent
  ✅ Performance: load < 2s

→ PUBLISH ✅
→ Post-publish verification ✅
→ Report to user
```

---

## J) STOP RULES (Infinite Loop Prevention)

| Rule | Trigger | Action |
|---|---|---|
| **Max Review Cycles** | Same item reviewed > 3 times | Orchestrator forces decision |
| **Max Fix Attempts** | Same bug fix attempted > 3 times | Rollback to last good state |
| **Max Agent Bounces** | Task bounced between 2 agents > 2 times | Orchestrator arbitrates |
| **Timeout** | Agent task running > 10 minutes with no output | Orchestrator escalates |
| **Circular Dependency** | Agent A waits for B, B waits for A | Orchestrator breaks cycle |
| **User Escalation** | Any unresolved conflict after 2 resolution attempts | Ask user |

---
