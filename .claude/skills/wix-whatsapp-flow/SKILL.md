---
name: wix-whatsapp-flow
description: WhatsApp Business kataloq inteqrasiyası, avtomatik mesaj şablonları
user_invocable: true
trigger: /wix-whatsapp-flow
---

# /wix-whatsapp-flow — WhatsApp İnteqrasiya

## Nə edir
WhatsApp Business ilə sayt arasında inteqrasiya qurur: kataloq paylaşma, sifariş sorğusu, avtomatik mesaj şablonları.

## İstifadə
```
/wix-whatsapp-flow setup         → WhatsApp link-ləri konfiqurasiya et
/wix-whatsapp-flow templates     → Mesaj şablonları yarat
/wix-whatsapp-flow catalog       → Kataloq mesajı formatla
```

## WhatsApp Link Formatı
```
https://api.whatsapp.com/send?phone=[NÖMRƏ]&text=[MESAJ]
```

## Mesaj Şablonları

### Ümumi Sorğu
```
Salam! MI CLEAN GROUP saytından yazıram.
Məhsullarınız haqqında məlumat almaq istəyirəm.
```

### Məhsul Sorğusu
```
Salam! Aşağıdakı məhsul(lar) haqqında qiymət təklifi istəyirəm:

{məhsul_siyahısı}

Şirkət: {şirkət_adı}
Əlaqə: {telefon}
```

### Kataloq Sorğusu
```
Salam! {kateqoriya} kateqoriyası üzrə tam kataloq göndərə bilərsiniz?
```

## Sayt İnteqrasiya Nöqtələri
1. **Float button** (saytın sağ altında) — ümumi sorğu
2. **Məhsul kartında** "WhatsApp-da soruş" — məhsul sorğusu
3. **Quote form** "WhatsApp ilə göndər" — sifariş siyahısı
4. **Footer** WhatsApp ikonu — ümumi sorğu
5. **Contact** bölməsində — ümumi sorğu

## Konfiqurasiya
```javascript
const WA_CONFIG = {
  number: '+994XXXXXXXXX',  // İstifadəçidən alınmalı
  defaultMessage: 'Salam! MI CLEAN GROUP saytından yazıram.',
  catalogMessage: (items) => `Qiymət sorğusu:\n${items.join('\n')}`,
  businessHours: { start: 9, end: 18, timezone: 'Asia/Baku' },
  offlineMessage: 'Hal-hazırda iş saatlarından kənardayıq. Ən qısa zamanda cavablayacağıq.'
};
```
