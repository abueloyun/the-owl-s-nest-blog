---
title: DNS & Digging – 1NF0-G4TH3R
published: 2026-04-09
description: ‫‫فهم DNS & dig واستخدامه في جمع Web Recon.‬
image: /images/posts/img_1NF0-G4TH3R/img_DNS & dig/DNS.wdmp
tags: [DNS, dig]
category: 1NF0-G4TH3R Series
draft: false
pinned: false
comment: true
lang: ar
---

# DNS

<div dir=rtl align="right">

Domain name system هو نظام وظيفته أنه يحول الأسماء اللي البشر بيفهمها مثل google.com إلي عناوين IP مناسبة مثل 192.168.1.1 اللغة اللي الكمبيوتر بيفهمها

---

## How DNS Works:

تخيل دلوقتي إنك عايز تخش علي موقع www.facebook.com فبسهولة بتروح فاتح المتصفح وتكتب إسم الموقع , لكن الكمبيوتر مش بيفهم الكلمات أو لغة البشر هو بيتعامل بس مع لغة الأرقام وتحديداً عناوين IP,  
كلام جميل , المفروض دلوقتي يبق عندك سؤال وهو إزاي بيحول من لغة البشر إلي عناوين IP مناسبة للكمبيوتر.

هنا بق بييجي دور الـ DNS:  
`The internet's trusty translator`

*تعالا بق ناخد رحلة صغيرة ونشوف العملية دي بتتم إزاي.*

<img src=/images/posts/img_1NF0-G4TH3R/img_DNS & dig/How DNS Works alt="How To Work DNS">

---

### 1. your computer asks for direction (DNS Query)

لما أنت بتدخل الـ Domain Name بتاع الموقع جهازك بيروح أول حاجة يدور عنده في الـ cach علشان يشوف هل هو محتفظ بعنوان الـ IP بتاع الموقع من زيارة سابقة ولا لا ولو ملقهوش بيرح علي طول بيتواصل مع DNS Resolver واللي هو غالباً بيبق تابع لمزود خدمة الإنترنت بتاعك ( ISP )

---

### 2. the DNS resolver checks its map (recursive lookup)

الـ resolver هو كمان عنده cache بيروح يدور فيها ولو لقاها بيرجعها للجهاز بتاعك ولو ملقهاش بيبدأ بعدها يروح لـ rook name server 

---

### 3. Root Name Server Points the way

الـ root server هو ميرفش الـ IP بتاع الـ Domain Name ده أي بالظبط ولكن هو عارف مين يعرف  

*طيب هو بيعمل أي بالظبط :*

الـ root بيرد عليك بحاجة اسمها referral يقولك أنا مش عارف الـ ip ده بس الـ TLD بتاع الـ Domain هو .com يبقي روح إسأل سيرفرات .com  

> فهو بس بيوجه الـ resolver في المكان الصح 

---

### 4. TLD Name server narrows it down

الـ TLD name server هو بيشبه الخريطة الإقليمية  
وهو اللي عارف الـ Authoritative name server المسؤول عن الـ specific domain وبعدها بيوجه الـ resolver لهناك.

---

### 5. Authoritative name server delivers the address

دي بتبق اخر محطة وهو اللي عنده الإجابة النهائية فبيجيب الـ IP وبيبعته للـ Resolver 

---

### 6. the DNS resolver returns the information

بيستلم الـ resolver عنوان الـ IP ويعيده إلي جهازك وبيحتفظ بيه في الـ caching عنده علشان لو إحتجته تاني قريباً 

---

### 7. your computer connects

دلوقتي جهازك بق عارف الـ IP ويقدر يتواصل مباشرة بالسيرفر اللي مستضيف الموقع وتبدأ تتصفح فيه عادي

---

## it's like a relay race

تخيل عملية DNS زي سباق تتابع  

- جهازك بيبدأ بالـ Domain  
- يمرره لـ Resolver  
- الـ resolver يمرره للـ root server  
- ثم للـ TLD server  
- ثم للـ Authoritative server  

وفي الأخر:  
يتم ايجاد الـ IP ويرجع بنفس الطريقة لحد ما يوصل لجهازك, بعدين تقدر تفتح الموقع.

---

## The Hosts File

<img src=/images/posts/img_1NF0-G4TH3R/ alt="Hosts File">

ملف الـ hosts هو simple text file بيستخدم لربط الـ host names بعناوين IP , بيوفر طريقة يدوية لعملية الـ Domain name resolution بدل ما تعتمد علي نظام الـ DNS  

بينما يقوم DNS بترجمة الـ Domain name إلي عناوين IP بشكل تلقائي يسمح لك ملف الـ Hosts بإنك تعمل تعديلات محلية مباشرة  

*وده بيبق مفيد جداً في:*

- Development  
- Troubleshooting  
- Blocking websites  

---

### - ملف الـ Hosts في ويندوز:

```bash
c:\windows\system32\drivers\etc\hosts
