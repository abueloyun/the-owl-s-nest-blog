---
title: Introduction – 1NF0-G4TH3R
published: 2026-04-04
description: ‫مقدمة شاملة عن Web Reconnaissance وأنواعه الأساسية.‬
tags: [Active Recon, Passive Recon]
category: 1NF0-G4TH3R Series
draft: false
pinned: false
comment: true
lang: ar
---

‫<div dir="rtl">
‫
# Web Reconnaissance – مقدمة

‫Web Reconnaissance أو Web Recon هو أول خطوة في أي عملية **penetration Testing**  
وفيه بتبدأ تجمع معلومات عن الموقع المستهدف، والمرحلة دي تعتبر تحضيرية قبل ما نحاول نلاقي فيه ثغرات.
‬
---

## ليه بنعمل Reconnaissance؟ وما الهدف منه؟
‫
### • Identifying Assets
في المرحلة دي بنحاول نكتشف كل المكونات المتاحة الخاصة بالهدف،  
واحنا هنا بنجمع كل حاجة ليها علاقة بالموقع.

فلنفترض إن عندك موقع اسمه `example.com`  
‫
في الخطوة دي بتحاول تجمع: 

‫1. ‫**Subdomains** مختلفة، زي `admin.example.com` أو `api.example.com`‬  
‫‬2. **عناوين الـ IP** الخاصة بالموقع  
‫‬3. **التقنيات المستخدمة**، هل الموقع بيستخدم `PHP` ولا `Node.JS`  
‬‬
---

### • Discovering Hidden Information
في المرحلة دي بندور على حاجات مش من المفروض تبقى ظاهرة، زي:  

- معلومات حساسة مكشوفة بالخطأ  
- ملفات Backup  
- ملفات Configuration أو مستندات داخلية  

الحاجات دي بتعرفنا تفاصيل مهمة ونقاط دخول ممكنة للهجوم.

---

### • Analysing the Attack Surface
هنا بنحدد كل الأماكن اللي المستخدم يقدر يتفاعل معها في الموقع، زي `(forms - APIs)`  

الهدف من المرحلة دي مش إني أكتشف ثغرات مباشرة،  
الهدف إنك تعرف فين ممكن يكون فيه ثغرات.  

وده بيتم عن طريق:  
- تحديد **input points**  
- تحديد **parameters**  
- مراقبة الداتا وهي راجعة بين المتصفح والسيرفر  

بإختصار:  
**attack surface = تعرف أو تحدد "أهاجم منين"**

---

### • Gathering Intelligence
هنا بنجمع معلومات نقدر نستغلها بعد كده في هجمات،  
زي مثلاً:  
لو لقيت **عناوين بريد إلكتروني**، بنحتفظ بيها، علشان لو قدرت بعد كده توصل لصفحة login،  
تقدر تستخدم الإيميلات دي للدخول.

---

## (Type of Reconnaissance)

احنا عندنا نوعين أساسين في **web reconnaissance**:  
**Active و Passive**  

وكل طريقة ليها مميزات وعيوب،  
وفهم الفرق بينهم مهم جدًا علشان تجمع معلومات بشكل صحيح وفعال.

---

### 1. Active Recon
<div align="center">

<img src="/src/assets/images/Active.png" alt="Active Recon" width="300"/>

</div>

النوع ده بيتطلب إنك تتفاعل مباشرة مع الهدف علشان تجمع معلومات.  

تخيل كده:  
> بدل ما تسأل الناس عن بيت معين،  
> انت بتروح بنفسك تخبط على الباب وتشوف مين بيرد وإيه اللي جوه،  
> ده بالظبط اللي بيحصل في **Active Recon**.

طرق التفاعل تشمل:  
- Port scanning  
- Network mapping  
- Service enumeration  
- Web spidering  

**مميزاته:**  
- بيديك معلومات ورؤية مباشرة وبيبق أكثر شمولاً عن بنية الهدف ومستوي الأمان الخاص به.  

**عيوبه:**  
- بيبق في خطورة أعلي إنك يتم إكتشافك لأنك بتتامل مع الهدف بشكل مباشر وده ممكن يعمل تنبيهات أو يثير الشك.

---

### 2. Passive Reconnaissance
<div align="center">

<img src="/src/assets/images/Passive.png" alt="Active Recon" width="300"/>

</div>

في النوع ده، انت بتجمع المعلومات **من غير ما تقرب للهدف** ولا تتفاعل معاه بشكل مباشر. 

تخيل كده:  
> بدل ما تخبط على باب بيت،  
> انت بتسأل الجيران وتشوف صور البيت على جوجل وتبحث عليه على الإنترنت،  
> ده بالظبط اللي بيحصل في **Passive Recon**.

طرق جمع المعلومات تشمل:  
- Search engine queries  
- Whois lookups  
- DNS analysis  
- Code repositories  

**مميزاته:**  
- يعتبر أكثر تخفياً وأقل عرضة لإكتشافه مقارنة بالـ Active Recon.  

**عيوبه:**  
- ممكن يديك معلومات أقل لأنه بيعتمد عل المتاح بالفعل بشكل عام.
‬
</div>‬‬‬
