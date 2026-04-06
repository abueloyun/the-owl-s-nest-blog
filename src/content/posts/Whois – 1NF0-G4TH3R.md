---
title: Whois – 1NF0-G4TH3R
published: 2026-04-06
description: ‫دليل سريع لفهم WHOIS وتحليل بيانات الدومينات‬
tags: [Whois Lookup]
category: 1NF0-G4TH3R Series
draft: false
pinned: false
comment: true
lang: ar
---

<div dir="rtl">

# Whois

Whois هو يعتبر بروتوكول أو أداة شغلته إنه يجمع بشكل أساسي معلومات عن الموارد المسجلة على الإنترنت وغالبًا بيُستخدم عشان تعرف معلومات عن domain names وكمان ممكن يجيب معلومات عن عناوين IP وAutonomous Systems.

---

## مثال توضيحي

هنفترض مثال يوضح الكلام ده أكتر:

عندي شخصين user1 & user2. دلوقتي user2 معاه حاجة زي دفتر متخزن فيه جميع أسماء الناس اللي عايشين في البلد، وجنب كل اسم فيه شوية معلومات زي رقم الاتصال، مكان السكن، وتواريخ مهمة زي متى سجل الشخص في البلد (Creation Date) ومتى هينتهي تسجيله (Expiration Date).

وفي يوم جه user1 محتاج يعرف معلومات عن شخص معين، فالأكيد هيروح لـ user2 لأنه هو معاه الدفتر اللي يقدر يوصل منه للمعلومات. فـ user1 يروح لـ user2 ويقوله: "أنا عايز معلومات عن الشخص كذا"، وuser2 ياخد الاسم ويروح للدفتر، يدور لحد ما يجيب الاسم والمعلومات، ويرجع يقول له.

هنا user2 يعتبر وسيط، لأنه هو اللي عنده صلاحية الوصول للدفتر، ولما حد يحتاج حاجة بيروح له عشان يجيب له المعلومات.

WHOIS بيعمل نفس اللي بيعمله user2، يعني هو أداة أو بروتوكول بيستخدم عشان تبعتله استعلام، وهو يرجعلك المعلومات من قواعد البيانات عن الموارد المسجلة على الإنترنت، زي:

- صاحب الدومين وبيانات الاتصال (حسب سياسة الخصوصية وPrivacy Protection)  
- تاريخ تسجيل الدومين وتاريخ انتهاءه  
- الـ Registrar المسؤول عن الدومين  

---

## مكونات سجل WHOIS

كل سجل في WHOIS عادة بيحتوي على المعلومات التالية:

- **اسم الدومين:** اسم الدومين نفسه (مثال: example.com)  
- **الـ Registrar:** الشركة اللي سجلت عندها الدومين (مثال: GoDaddy أو Namecheap)  
- **الـ Registrant Contact:** الشخص أو المؤسسة اللي سجلت الدومين  
- **الـ Administrative Contact:** الشخص المسؤول عن إدارة الدومين  
- **الـ Technical Contact:** الشخص اللي بيتعامل مع المشاكل التقنية الخاصة بالدومين  
- **تاريخ الإنشاء والانتهاء:** متى تم تسجيل الدومين ومتى هيخلص تسجيله  
- **الـ Name Servers:** الخوادم اللي بتحول اسم الدومين لعناوين IP  

---

## ليه WHOIS مهم في (Web Recon)

بيانات WHOIS تعتبر كنز من المعلومات للـ penetration testers خلال مرحلة الاستطلاع (reconnaissance) قبل أي تقييم أمني لأنها يقدرو منها يعرفو:

### • مصدر معلومات عن الأشخاص المسؤولين

سجلات WHOIS ممكن تكشف اسماء، إيميلات، وأرقام تليفونات الأشخاص اللي مسؤولين عن الدومين.  
الباحث الأمني ممكن يستخدمها لفهم مين المسؤولين أو حتى لهجمات هندسة اجتماعية (Social Engineering) أو تصيد (Phishing).

### • كشف بنية الشبكة

تفاصيل زي الـ Name Servers وعناوين IP بتدي معلومات عن الشبكة الداخلية للهدف.  
ده بيساعد الباحث على تحديد نقاط ضعف ممكنة أو أخطاء إعدادات الشبكة.

### • تحليل التغييرات التاريخية

الوصول لسجلات WHOIS القديمة عبر خدمات زي WhoisFreaks بيكشف تغييرات في الملكية، معلومات الاتصال، أو تفاصيل تقنية على مر الوقت.  
ده مهم لفهم تطور البصمة الرقمية للهدف وكيف اتغيرت عبر الزمن.

---

## Scenario 1: Phishing Investigation

جهاز حماية البريد الإلكتروني كشف رسالة مشبوهة وصلت لعدة موظفين في الشركة. الرسالة بتدعي إنها من بنك الشركة وبتطلب من الناس الضغط على رابط لتحديث بيانات الحساب. محلل الأمن بدأ التحقيق بعمل WHOIS lookup على الدومين اللي في الرسالة.

سجل WHOIS كشف الآتي:

- **تاريخ التسجيل:** الدومين اتسجل من أيام قليلة.  
- **المالك (Registrant):** المعلومات مخفية عبر خدمة خصوصية.  
- **Name Servers:** الخوادم مرتبطة بمزود استضافة معروف باسم Bulletproof Hosting وغالبًا بيستخدم لأغراض ضارة.  

المزيج ده رفع Red Flags كبيرة. تاريخ التسجيل الجديد، البيانات المخفية، والاستضافة المشبوهة كلها تشير لإحتمالية وجود حملة تصيد. المحلل بلغ بسرعة قسم الـ IT لحظر الدومين وحذر الموظفين.

> لما الرسالة تكون تصيدية (Phishing Email)، غالبًا فيها رابط بيحاول يخدعك تدخل عليه. الدومين اللي هنعمله WHOIS lookup بيكون جزء من الرابط في الرسالة، مش بالضرورة اسم البنك أو الشركة الحقيقي اللي الظاهر في الرسالة.

مثال:
### مثال على رسالة تصيد (Phishing Email)

<div style="max-width:600px; margin:auto; border:1px solid #e0e0e0; border-radius:8px; font-family:Arial, sans-serif; background:#ffffff;">

  <!-- Header -->
  <div style="padding:12px 16px; border-bottom:1px solid #eee; display:flex; align-items:center; gap:10px;">
    <div style="width:40px; height:40px; border-radius:50%; background:#1a73e8; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">
    </div>
    <div>
      <div style="font-weight:bold;">Your Bank</div>
      <div style="font-size:12px; color:#666;">support@yourbank.com</div>
    </div>
  </div>

  <!-- Subject -->
  <div style="padding:12px 16px; font-size:18px; font-weight:bold; border-bottom:1px solid #eee;">
    ⚠️ Urgent: Verify Your Account Information
  </div>

  <!-- Email Body -->
  <div style="padding:16px; color:#202124; line-height:1.6; font-size:14px;">
    ```
    Dear Customer,<br><br>
```
    We detected unusual activity on your bank account.<br>
    To ensure your account remains secure, please verify your information immediately.<br><br>
```
    <div style="text-align:center; margin:20px 0;">
      <a href="#" style="background:#1a73e8; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; font-weight:bold;">
        Verify Account
      </a>
    </div>
```
    <div style="font-size:12px; color:#555; text-align:center;">
      Or copy and paste this link into your browser:<br>
      <span style="color:#1a73e8;">https://example-bank123.com/login</span>
    </div>
```
    <br><br>
```
    Failure to verify your account within 24 hours may result in temporary suspension.<br><br>
```
    Best regards,<br>
    <strong>Your Bank Security Team</strong>

  </div>
</div>

---

**الدومين الحقيقي اللي هنعمله WHOIS lookup هو:**  
`example-bank123.com`  

> مش `yourbank.com`، لأن ده مجرد اسم ظاهر في الإيميل عشان يخدعك.
---

## مثال WHOIS على facebook.com


  ```bash
AbuEIOyun1@kali[~]$ whois facebook.com

Domain Name: FACEBOOK.COM
Registry Domain ID: 2320948_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrarsafe.com
Registrar URL: http://www.registrarsafe.com/
Updated Date: 2024-04-24T19:06:12Z
Creation Date: 1997-03-29T05:00:00Z
Registry Expiry Date: 2033-03-30T04:00:00Z
Registrar: RegistrarSafe, LLC
Registrar IANA ID: 3237
Registrar Abuse Contact Email: abusecomplaints@registrarsafe.com
Registrar Abuse Contact Phone: +1-650-308-7004
Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
Domain Status: serverDeleteProhibited https://icann.org/epp#serverDeleteProhibited
Domain Status: serverTransferProhibited https://icann.org/epp#serverTransferProhibited
Domain Status: serverUpdateProhibited https://icann.org/epp#serverUpdateProhibited
Name Server: A.NS.FACEBOOK.COM
Name Server: B.NS.FACEBOOK.COM
Name Server: C.NS.FACEBOOK.COM
Name Server: D.NS.FACEBOOK.COM
DNSSEC: unsigned
URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
Last update of whois database: 2024-06-01T11:24:10Z <<<
```

---

## تحليل النتيجة بعد WHOIS Lookup

### • معلومات تسجيل الدومين (Domain Registration)

- **Registrar:** RegistrarSafe, LLC  
- **Creation Date:** 1997-03-29  
- **Expiry Date:** 2033-03-30  

> ده بيورينا إن الدومين مسجل عند RegistrarSafe, LLC وتم تسجيله أول مرة يوم 29 مارس 1997، وموعد انتهاء التسجيل هيكون 2033.

### • معلومات المالك (Domain Owner)

- **Organization:** Meta Platforms, Inc.  
- **Contact:** Domain Admin  

> ده الشخص أو الكيان المسؤول عن الدومين سواء للإدارة أو للجانب الفني.

### • حالة الدومين (Domain Status)

- clientDeleteProhibited  
- clientTransferProhibited  
- clientUpdateProhibited  
- serverDeleteProhibited  
- serverTransferProhibited  
- serverUpdateProhibited  

> الحالات دي بتوضح القيود الأمنية اللي مفروضة على الدومين لمنع حذفه، نقله، أو تعديل بياناته بدون إذن.

### • خوادم الأسماء (Name Servers)

- A.NS.FACEBOOK.COM  
- B.NS.FACEBOOK.COM  
- C.NS.FACEBOOK.COM  
- D.NS.FACEBOOK.COM  

> الخوادم دي مسؤولة عن تحويل اسم الدومين لعناوين IP عشان يقدر المستخدم يوصل للموقع.


</div>
