---
name: whatsapp-commerce
description: WhatsApp Business inteqrasiya — kataloq, avtomatik cavab, sifariş izləmə
type: agent
layer: Content
scope: WhatsApp Business API, mesaj şablonları, kataloq, sifariş flow
triggers:
  - "whatsapp qur" əmri
  - /wix-whatsapp-flow skill-dən çağırılır
---

# WhatsApp Commerce Agent

## Rol
WhatsApp Business ilə sayt arasında tam inteqrasiya qurur: click-to-chat, kataloq paylaşma, sifariş sorğusu flow, avtomatik cavab mesajları.

## Sayt İnteqrasiya Nöqtələri

### 1. Float Button (sağ alt künc)
```html
<a id="wafloat" href="https://api.whatsapp.com/send?phone=NÖMRƏ&text=Salam"
   target="_blank" rel="noopener" aria-label="WhatsApp ilə əlaqə">
  <svg><!-- WhatsApp icon --></svg>
</a>
```

### 2. Məhsul Kartında
```html
<button class="pc-wa" onclick="waProduct(this)" aria-label="WhatsApp-da soruş">
  <svg><!-- WA icon --></svg> Soruş
</button>
```

### 3. Quote Formunda
```html
<button id="wa-quote" onclick="waQuote()">
  WhatsApp ilə göndər
</button>
```

### 4. Contact Bölməsində
```html
<a class="wa-contact" href="https://api.whatsapp.com/send?phone=NÖMRƏ">
  WhatsApp: +994 XX XXX XX XX
</a>
```

### 5. Footer-da
```html
<a class="ft-item" href="https://api.whatsapp.com/send?phone=NÖMRƏ">
  WhatsApp
</a>
```

## Mesaj Flow-ları

### Ümumi Sorğu
```
Müştəri → Float button click
→ WhatsApp açılır
→ Avtomatik mesaj: "Salam! MI CLEAN GROUP saytından yazıram."
```

### Məhsul Sorğusu
```
Müştəri → Məhsul kartında WA button
→ WhatsApp açılır
→ Avtomatik mesaj:
  "Salam! Bu məhsul haqqında məlumat almaq istəyirəm:
   📦 [Məhsul adı]
   🔢 Kod: [məhsul kodu]
   📁 Kateqoriya: [kateqoriya]"
```

### Quote Sorğusu
```
Müştəri → Quote formunda WA button
→ WhatsApp açılır
→ Avtomatik mesaj:
  "Salam! Aşağıdakı məhsullar üçün qiymət təklifi istəyirəm:

   1. [Məhsul 1] (kod: XXX)
   2. [Məhsul 2] (kod: XXX)
   3. [Məhsul 3] (kod: XXX)

   Şirkət: ___
   Əlaqə: ___"
```

## JavaScript İmplementasiya
```javascript
const WA = {
  number: '+994XXXXXXXXX', // Real nömrə lazım!

  open(msg) {
    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=${this.number}&text=${encoded}`, '_blank');
  },

  general() {
    this.open('Salam! MI CLEAN GROUP saytından yazıram. Məlumat almaq istəyirəm.');
  },

  product(name, code, category) {
    this.open(`Salam! Bu məhsul haqqında məlumat istəyirəm:\n📦 ${name}\n🔢 ${code}\n📁 ${category}`);
  },

  quote(items) {
    const list = items.map((item, i) => `${i+1}. ${item.name} (${item.code})`).join('\n');
    this.open(`Qiymət sorğusu:\n\n${list}\n\nŞirkət: ___\nƏlaqə: ___`);
  }
};
```

## İş Saatları İnteqrasiya
```javascript
function isBusinessHours() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0=Bazar, 6=Şənbə
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// İş saatlarından kənarda mesaj
if (!isBusinessHours()) {
  // Float button tooltip: "Hal-hazırda qapalıyıq. Mesajınız qeydə alınacaq."
}
```

## Gözləyən
- [ ] Real WhatsApp Business nömrəsi (istifadəçidən)
- [ ] WA Business profil qurulması
- [ ] Sayt embed-lərində nömrə əvəzlənməsi
