---
name: form-integration
description: Contact və Quote formlarını Wix Forms/CRM ilə inteqrasiya edir
type: agent
layer: Content
scope: Form submission, Wix CRM, email notification, WhatsApp
triggers:
  - "form qur" əmri
  - "contact inteqrasiya" əmri
  - Form submission test uğursuz olduqda
---

# Form Integration Agent

## Rol
Hal-hazırda `mailto:` ilə işləyən Contact və Quote formlarını real backend-ə (Wix Forms API, CRM, email notification) qoşur. WhatsApp inteqrasiyasını real nömrə ilə qurur.

## Mövcud Vəziyyət
```
Contact form → mailto:info@micleangroup.az (JS redirect)
Quote form → mailto:info@micleangroup.az (JS redirect)
WhatsApp → +994 50 000 00 00 (PLACEHOLDER — real nömrə lazım!)
Telefon → +994 50 000 00 00 (PLACEHOLDER)
```

## Hədəf Vəziyyət
```
Contact form → Wix Form submission → CRM + Email notification
Quote form → Wix Form submission → CRM + Email notification
WhatsApp → Real nömrə ilə api.whatsapp.com link
Telefon → Real nömrə ilə tel: link
```

## Formlar

### Contact Form Sahələri
| Sahə | id | type | required |
|------|----|------|----------|
| Ad Soyad | `c-name` | text | Bəli |
| E-poçt | `c-email` | email | Bəli |
| Telefon | `c-phone` | tel | Xeyr |
| Mesaj | `c-msg` | textarea | Bəli |

### Quote Form Sahələri
| Sahə | id | type | required |
|------|----|------|----------|
| Şirkət adı | `q-name` | text | Bəli |
| E-poçt | `q-email` | email | Bəli |
| Telefon | `q-phone` | tel | Xeyr |
| Mesaj/Siyahı | `q-msg` | textarea | Xeyr |
| Seçilmiş məhsullar | `q-items` | hidden | Xeyr |

## İnteqrasiya Variantları

### Variant A: Wix Forms API (Tövsiyə)
```javascript
// Embed JS-də:
async function submitForm(formData, formType) {
  // Wix Forms REST API
  const response = await fetch(
    'https://www.wixapis.com/wix-forms/v4/submissions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <API_KEY>'
      },
      body: JSON.stringify({
        formId: formType === 'contact' ? CONTACT_FORM_ID : QUOTE_FORM_ID,
        submissions: [{
          values: formData
        }]
      })
    }
  );
}
```

**Problem**: API key embed-də açıq olacaq → Təhlükəsizlik riski

### Variant B: Wix Velo Backend (Alternativ)
```
1. Wix Editor → Dev Mode → Backend code
2. http-functions.js yaradılır
3. Form data POST olunur
4. Backend Wix CRM-ə yazır
```

**Problem**: Wix Velo tələb edir, embed-dən çağırmaq çətin

### Variant C: Third-Party Form Service (Praktik)
```javascript
// Formspree, Getform, və ya Netlify Forms
async function submitForm(formData) {
  const response = await fetch('https://formspree.io/f/FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (response.ok) {
    showToast('Mesajınız göndərildi!', 'success');
  }
}
```

**Üstünlük**: API key lazım deyil, email notification daxili, spam filter var

### Variant D: Mailto + Enhancement (Mövcud + Təkmilləşdirmə)
```javascript
// Mövcud mailto-nu saxla amma UX yaxşılaşdır
function submitContact(formData) {
  const subject = encodeURIComponent('Saytdan əlaqə: ' + formData.name);
  const body = encodeURIComponent(
    `Ad: ${formData.name}\nEmail: ${formData.email}\nTelefon: ${formData.phone}\n\n${formData.message}`
  );
  window.open(`mailto:info@micleangroup.az?subject=${subject}&body=${body}`);
  showToast('E-poçt proqramınız açılacaq', 'info');
}
```

## WhatsApp İnteqrasiya
```javascript
// Real nömrə əlavə olunmalıdır
const WHATSAPP_NUMBER = '+994XXXXXXXXX'; // İstifadəçidən alınmalı

function openWhatsApp(message = '') {
  const encoded = encodeURIComponent(message || 'Salam, məlumat almaq istəyirəm');
  window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`);
}

// Quote form-dan WhatsApp-a göndərmə
function sendQuoteWhatsApp(items) {
  const list = items.map(i => `- ${i.name} (${i.code})`).join('\n');
  const msg = `Sifariş sorğusu:\n${list}\n\nŞirkət: [ad]\nTelefon: [tel]`;
  openWhatsApp(msg);
}
```

## Spam Qoruma
```
1. Honeypot field (gizli input — bot-lar doldurur, insanlar görmür)
   <input type="text" name="website" style="display:none" tabindex="-1">

2. Zaman yoxlaması (form 2 saniyədən tez submit olunursa → spam)
   const formLoadTime = Date.now();
   if (Date.now() - formLoadTime < 2000) return;

3. Rate limiting (eyni IP-dən 5 dəqiqədə max 3 submission)
   localStorage key ilə client-side limit
```

## Validasiya (client-side)
```javascript
function validateForm(form) {
  const errors = [];
  const email = form.querySelector('[type="email"]').value;
  const name = form.querySelector('[id$="-name"]').value;

  if (!name.trim()) errors.push('Ad daxil edin');
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Düzgün e-poçt daxil edin');
  // Telefon optional — validate format only if provided
  const phone = form.querySelector('[type="tel"]')?.value;
  if (phone && !phone.match(/^\+?[\d\s\-()]{7,}$/)) errors.push('Düzgün telefon nömrəsi daxil edin');

  return errors;
}
```

## Test Ssenarisi
1. Contact form — bütün sahələr dolu → uğurlu göndərmə
2. Contact form — boş sahələr → validasiya xətası
3. Quote form — məhsul siyahısı ilə → düzgün format
4. WhatsApp button → düzgün nömrə ilə açılma
5. Spam test — honeypot dolu → reject

## Gözləyən Hərəkət
- [ ] İstifadəçidən real WhatsApp nömrəsi almaq
- [ ] İstifadəçidən real telefon nömrəsi almaq
- [ ] Form backend variantı seçimi (A/B/C/D)
- [ ] Formspree/Getform hesabı yaratmaq (əgər Variant C seçilsə)
