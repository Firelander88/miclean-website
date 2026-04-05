---
name: uptime-monitor
description: Sayt uptime monitoring — downtime aşkarlama, alert, status hesabat
type: agent
layer: Quality
scope: Uptime check, response time, SSL, alert
triggers:
  - "uptime yoxla" əmri
  - Planlanmış cron task (hər 30 dəq)
  - Publish sonrası
---

# Uptime Monitor Agent

## Rol
micleangroup.com saytının əlçatanlığını izləyir: HTTP status, response time, SSL sertifikat, embed yüklənmə.

## Yoxlama Nöqtələri

### 1. Əsas Sayt
```
URL: https://www.micleangroup.com
Gözlənən: HTTP 200
Max response time: 5 saniyə
Yoxlama tezliyi: 30 dəqiqədə 1
```

### 2. SSL Sertifikat
```
Domain: micleangroup.com
Yoxla: sertifikat etibarlılığı, müddət
Alert: müddət bitməsinə 30 gün qalanda
```

### 3. Embed Yüklənmə
```
Sayt yüklənəndə custom embed-lərin DOM-da olub-olmadığını yoxla:
- nav elementi mövcud?
- .cover bölməsi mövcud?
- .sec bölmələri mövcud?
- footer mövcud?
Əgər yoxdursa → embed problem
```

### 4. Console Errors
```
Saytda JS console error-ları yoxla:
- TypeError, ReferenceError → JS embed problemi
- 404 fetch error → resource yüklənmir
- CORS error → xarici resurs bloklanıb
```

## Alert Səviyyələri

| Səviyyə | Şərt | Hərəkət |
|---------|------|---------|
| KRİTİK | Sayt 5+ dəq aşağıdır | Dərhal bildiriş |
| YÜKSƏK | Response > 10 saniyə | 3 ardıcıl yoxlamada təkrarlanırsa alert |
| ORTA | Embed yüklənmir | Embed Sync Agent-ə eskalasiya |
| AŞAĞI | SSL < 30 gün | Həftəlik hesabatda qeyd |

## Status Hesabat
```markdown
## Uptime Hesabat — [tarix aralığı]

### Xülasə
- Uptime: 99.8%
- Orta response: 1.2 saniyə
- Downtime: 14 dəqiqə (1 hadisə)
- SSL: etibarlı, 287 gün qalır

### Hadisələr
| Tarix | Müddət | Tip | Təsvir |
|-------|--------|-----|--------|
| 2026-03-15 03:00 | 14 dəq | Wix maintenance | Planlı |

### Trend
- Bu ay: 99.8%
- Keçən ay: 99.9%
- 3 aylıq orta: 99.85%
```

## İmplementasiya
Bu agent aşağıdakı üsullarla işləyə bilər:

### Variant A: Claude Code Schedule
```
/schedule ilə hər 30 dəqiqədə saytı yoxla
```

### Variant B: External Service
- UptimeRobot (pulsuz, 5 dəq interval)
- Freshping (pulsuz)
- StatusCake (pulsuz plan)

### Variant C: Manual Yoxlama
```
/wix-qa --uptime əmri ilə manual trigger
```
