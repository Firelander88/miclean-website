---
name: wix-product-writer
description: AI ilə məhsul təsviri, texniki xarakteristika və istifadə təlimatı yazır (AZ/EN/RU)
user_invocable: true
trigger: /wix-product-writer
---

# /wix-product-writer — Məhsul Content Yazıcı

## Nə edir
273 məhsul üçün professional təsvirlər yazır: qısa təsvir, texniki xarakteristika, istifadə təlimatı, təhlükəsizlik məlumatı. AZ, EN, RU dillərində.

## İstifadə
```
/wix-product-writer                    → Təsvirsiz bütün məhsulları tap
/wix-product-writer KIM-001            → Tək məhsul üçün yaz
/wix-product-writer kimyəvi            → Kateqoriya üçün yaz
/wix-product-writer --lang=en          → İngilis dilində yaz
```

## Məhsul Təsvir Strukturu

### 1. Qısa Təsvir (50-80 söz)
```
[Məhsul adı] — [əsas funksiyası]. [Harada istifadə olunur].
[Əsas üstünlük 1]. [Əsas üstünlük 2].
[Sertifikat/standart].
```

### 2. Texniki Xarakteristika
```
- Həcm/Çəki: [dəyər]
- Tərkib: [əsas komponentlər]
- pH: [dəyər]
- Rəng/Qoxu: [təsvir]
- İstifadə temperaturu: [aralıq]
- Saxlama şərtləri: [şərt]
- Yararlılıq müddəti: [müddət]
```

### 3. İstifadə Təlimatı
```
1. [Hazırlıq addımı]
2. [Əsas istifadə]
3. [Dozaj/nisbət]
4. [Gözləmə müddəti]
5. [Yekun addım]
```

### 4. Təhlükəsizlik
```
- Qoruyucu avadanlıq: [əlcək, eynək, və s.]
- Dəri təması: [tədbir]
- Göz təması: [tədbir]
- Saxlama: [şərt]
```

## Kateqoriyaya Görə Ton

| Kateqoriya | Ton | Fokus |
|-----------|-----|-------|
| Kimyəvi | Texniki, professional | Effektivlik, təhlükəsizlik, dozaj |
| Camaşırxana | Praktik, nəticə-yönümlü | Ləkə çıxarma, parlaqlıq, qənaət |
| Mətbəx | Gigiyena-fokuslu | HACCP, qida təhlükəsizliyi |
| Amenity | Premium, lüks | Qonaq təcrübəsi, ətir, dizayn |
| İstehlak | Sadə, anlaşılan | Evdə istifadə, əlçatanlıq |
| Housekeeping | Professional, effektiv | Sürət, əhatə, çoxfunksiyalılıq |
| Hovuz | Texniki, dəqiq | pH balansı, dozaj, təhlükəsizlik |

## Output
Hər məhsul üçün HTML formatında output:
```html
<div class="pc-desc">
  <p class="pc-short">[Qısa təsvir]</p>
  <ul class="pc-specs">
    <li><strong>Həcm:</strong> 5L</li>
    ...
  </ul>
</div>
```

## Keyfiyyət Yoxlaması
- [ ] Məhsul adı düzgün yazılıb
- [ ] Kateqoriyaya uyğun ton
- [ ] Texniki məlumatlar dəqiq (Excel data ilə uyğun)
- [ ] AZ dilində qrammatik düzgün
- [ ] SEO açar sözlər daxil edilib
- [ ] Təhlükəsizlik məlumatı var (kimyəvi məhsullar üçün)
