# MI CLEAN GROUP — Agent System Instructions

## Auto-Orchestration

Hər tapşırıqda bu qaydaları **avtomatik** izlə:

1. Sorğunu analiz et → aşağıdakı routing cədvəlinə bax
2. Uyğun agent və/və ya skill-i **dərhal** aktivləşdir (soruşma, birbaşa işlət)
3. Mürəkkəb tapşırıqlarda paralel agent-lər spawn et (Agent tool ilə)
4. Publish öncəsi QA + Security checklist keçir
5. Nəticəni birləşdir və istifadəçiyə təqdim et

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
- **Custom Embeds**: 17 (4 data + 3 CSS + 6 HTML + 3 JS + 1 Wix Hide)
- **179 Skill**: `.claude/skills/` (62 layihə + 117 community)
- **93 Agent**: `.claude/agents/` (33 layihə + 60 community)

## Avtomatik Agent Routing

Sorğuda bu açar sözlər varsa, uyğun agent-i **avtomatik** spawn et:

### Wix & Layihə Agentləri
| Trigger sözlər | Agent/Skill | Qovluq |
|---|---|---|
| SEO, meta, Google ranking, axtarış | `/wix-seo` | skills/wix-seo |
| publish, deploy, canlıya çıx | `/wix-publish` | skills/wix-publish |
| QA, test, bug, yoxla | `/wix-qa` | skills/wix-qa |
| content, məzmun, təsvir yaz | `/wix-content-az` | skills/wix-content-az |
| məhsul yaz, product description | `/wix-product-writer` | skills/wix-product-writer |
| Excel, CSV, import, idxal | `/wix-excel-import` | skills/wix-excel-import |
| backup, yedəklə, export data | `/wix-backup` | skills/wix-backup |
| embed, sync, sinxron | `/wix-embed-sync` | skills/wix-embed-sync |
| responsive, mobil, ekran ölçüsü | `/wix-responsive-test` | skills/wix-responsive-test |
| şəkil, image, foto | `/wix-image-audit` | skills/wix-image-audit |
| Google Business, GMB | `/wix-google-business` | skills/wix-google-business |
| testimonial, rəy, review | `/wix-testimonial` | skills/wix-testimonial |
| WhatsApp, mesaj şablon | `/wix-whatsapp-flow` | skills/wix-whatsapp-flow |
| sitemap, robots.txt | `/wix-sitemap` | skills/wix-sitemap |
| A/B test, variant | `/wix-ab-test` | skills/wix-ab-test |
| changelog, dəyişiklik | `/wix-changelog` | skills/wix-changelog |
| blog, məqalə, article | `/wix-blog-az` | skills/wix-blog-az |
| email, newsletter, kampaniya | `/wix-email-campaign` | skills/wix-email-campaign |
| CRM, müştəri, contact, lead | `/wix-crm` | skills/wix-crm |
| qiymət, price, tarif | `/wix-price-manager` | skills/wix-price-manager |
| PDF quote, təklif, proposal | `/wix-quote-pdf` | skills/wix-quote-pdf |
| hesabat, report, statistika | `/wix-report` | skills/wix-report |
| analytics, ziyarətçi, traffic | `/wix-analytics` | skills/wix-analytics |
| a11y, accessibility, əlçatanlıq | `/wix-a11y` | skills/wix-a11y |
| performance, sürət, speed | `/wix-performance` | skills/wix-performance |
| tərcümə, translate, i18n | `/wix-i18n` | skills/wix-i18n |
| social media, post, calendar | `/wix-social-calendar` | skills/wix-social-calendar |
| rəqib, competitor, market | `/wix-competitor-watch` | skills/wix-competitor-watch |
| FAQ, sual-cavab | `/wix-faq-generator` | skills/wix-faq-generator |
| embed yarat, widget, komponent | `/wix-embed-builder` | skills/wix-embed-builder |
| brand, banner, dizayn | `/wix-brand-designer` | skills/wix-brand-designer |

### Development Agentləri (community)
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| arxitektura, refactor, struktur | system-architect | agents/community/system-architect.md |
| API, endpoint, REST, GraphQL | api-builder | agents/community/api-builder.md |
| database, SQL, query, schema | database-expert | agents/community/database-expert.md |
| performance, cache, optimize | performance-engineer | agents/community/performance-engineer.md |
| kod təmizlə, cleanup, refactor | code-refactorer | agents/community/code-refactorer.md |
| integration, webhook, OAuth | integration-master | agents/community/integration-master.md |
| mobil, PWA, offline, touch | mobile-optimizer | agents/community/mobile-optimizer.md |
| a11y, WCAG, screen reader | accessibility-pro | agents/community/accessibility-pro.md |

### Quality & Testing Agentləri
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| test yaz, unit test, E2E | test-generator | agents/community/test-generator.md |
| security, vulnerability, XSS | security-scanner | agents/community/security-scanner.md |
| code review, PR review | code-reviewer | agents/community/code-reviewer.md |
| load test, stress test | load-tester | agents/community/load-tester.md |
| Playwright, E2E, browser test | playwright-expert | agents/community/playwright-expert.md |
| debug, error, stack trace | debugger | agents/community/debugger.md |

### DevOps & Operations Agentləri
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| CI/CD, pipeline, GitHub Actions | deployment-wizard | agents/community/deployment-wizard.md |
| infrastructure, cloud, AWS | infrastructure-builder | agents/community/infrastructure-builder.md |
| monitoring, alert, dashboard | monitoring-expert | agents/community/monitoring-expert.md |
| release, rollback, feature flag | release-manager | agents/community/release-manager.md |
| cost, bill, spending, qənaət | cost-optimizer | agents/community/cost-optimizer.md |
| Kubernetes, K8s, Helm | kubernetes-specialist | agents/community/kubernetes-specialist.md |
| Terraform, IaC | terraform-expert | agents/community/terraform-expert.md |
| Docker, container, image | docker-expert | agents/community/docker-expert.md |
| SRE, SLO, incident | sre-engineer | agents/community/sre-engineer.md |

### Language & Framework Agentləri
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| TypeScript, TS, type safety | typescript-pro | agents/community/typescript-pro.md |
| Python, pip, Django, Flask | python-pro | agents/community/python-pro.md |
| Rust, ownership, borrow | rust-engineer | agents/community/rust-engineer.md |
| Go, goroutine, channel | go-expert | agents/community/go-expert.md |
| Java, Spring, JVM | java-architect | agents/community/java-architect.md |
| C#, .NET, ASP.NET | csharp-developer | agents/community/csharp-developer.md |
| Next.js, App Router, SSR | nextjs-expert | agents/community/nextjs-expert.md |
| React, hooks, useState | react-specialist | agents/community/react-specialist.md |
| Vue, Composition API, Pinia | vue-expert | agents/community/vue-expert.md |
| Laravel, Eloquent, PHP | laravel-specialist | agents/community/laravel-specialist.md |

### AI & Data Agentləri
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| AI, LLM, ChatGPT, embedding | ai-integration-expert | agents/community/ai-integration-expert.md |
| prompt, chain-of-thought | prompt-engineer | agents/community/prompt-engineer.md |
| ML, model, training, pipeline | ml-engineer | agents/community/ml-engineer.md |
| ETL, data warehouse, pipeline | data-engineer | agents/community/data-engineer.md |
| LangChain, RAG, vector | langchain-expert | agents/community/langchain-expert.md |
| automation, cron, workflow | automation-builder | agents/community/automation-builder.md |

### Business & UX Agentləri
| Trigger sözlər | Agent | Fayl |
|---|---|---|
| UX, user flow, usability | ux-optimizer | agents/community/ux-optimizer.md |
| UI, animation, polish, design | ui-polisher | agents/community/ui-polisher.md |
| landing page, CTA, conversion | landing-page-optimizer | agents/community/landing-page-optimizer.md |
| analytics, funnel, tracking | analytics-engineer | agents/community/analytics-engineer.md |
| email, drip, campaign | email-automator | agents/community/email-automator.md |
| GDPR, CCPA, compliance | compliance-expert | agents/community/compliance-expert.md |
| SEO, schema, sitemap | seo-master | agents/community/seo-master.md |
| product strategy, roadmap | product-strategist | agents/community/product-strategist.md |
| growth, viral, retention | growth-engineer | agents/community/growth-engineer.md |

### Community Skill-lər (avtomatik aktivləşir)
`.claude/skills/community-skills/` qovluğundakı 117 skill kontekstə görə avtomatik aktivləşir:
- **Security**: CSRF, CORS, SQL injection, secret scanning, auth validation
- **Testing**: Unit test, regression, load test, performance test, E2E
- **Database**: SQL optimize, backup, audit log, seed data, NoSQL
- **DevOps**: Ansible, Docker, K8s, Terraform, CI/CD pipeline
- **AI/ML**: NLP, sentiment, hyperparameter, neural network, model deploy
- **Data**: Visualization, time series, experiment tracking, ETL
- **Documents**: PDF, XLSX, PPTX, DOCX manipulation

## Routing Qaydası

1. Sorğu Wix/sayt kontekstindədirsə → **Wix skill** istifadə et
2. Sorğu kod/development kontekstindədirsə → **Community agent** spawn et
3. Mürəkkəb tapşırıqda → **paralel** agent-lər spawn et (Agent tool, subagent_type)
4. Heç bir routing uyğun gəlmirsə → Orchestrator kimi davran, özün həll et
5. Hər zaman **birbaşa icra et**, soruşma
