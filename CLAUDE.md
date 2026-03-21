# MI CLEAN GROUP — Agent System Instructions

## Auto-Orchestration

Hər tapşırıqda bu qaydaları izlə:

1. `.claude/agents/WIX_SUPER_AGENT_SYSTEM.md` faylını oxu
2. **Orchestrator** rolunu götür
3. Tapşırığı analiz et → uyğun agentlərə böl
4. Task Routing Rules-a əsasən agent seç
5. Parallel işləyə bilənləri eyni anda başlat
6. Review chain-ə əməl et
7. QA & Fix loop-u tətbiq et
8. Nəticəni birləşdir və istifadəçiyə təqdim et

## Əsas Qaydalar

- Sadəcə tövsiyə vermə, birbaşa icra et
- Destruktiv əməliyyatlar (silmə, rollback) üçün user təsdiqi al
- Publish öncəsi mütləq QA + Security checklist keçir
- Hər CMS bulk əməliyyatdan əvvəl backup al
- Max 3 review dövrü — sonra qərar ver
- Dil: Azərbaycan dili (birincili), istifadəçi hansı dildə yazırsa o dildə cavab ver

## Sayt Konteksti

- **Şirkət**: MI CLEAN GROUP MMC
- **Sayt**: www.micleangroup.com (Wix)
- **Site ID**: `b770c699-0cb2-4b4e-914a-80a3e7280e48`
- **CMS Collection**: `MicleanKatalog` (490 məhsul, 7 kateqoriya)
- **Custom Embeds**: 6 (5 data + 1 UI catalog)
- **22 Skill**: `.claude/skills/` qovluğunda
- **17 Agent**: `.claude/agents/` qovluğunda

## Skill İstifadəsi

Tapşırıq uyğun skill-ə düşürsə, həmin skill-i aktivləşdir:
- SEO işləri → `/wix-seo`
- Content yazma → `/wix-content-az`
- Catalog sync → `/wix-catalog-sync`
- QA test → `/wix-qa`
- Publish → `/wix-publish`
- CMS import → `/wix-excel-import`
- Backup → `/wix-backup`
- Digərləri → `.claude/skills/` qovluğuna bax
