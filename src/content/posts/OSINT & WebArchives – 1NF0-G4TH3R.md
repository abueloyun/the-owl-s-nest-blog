---
title: HTB | 1NF0-G4TH3R – OSINT & Web Archives
published: 2026-05-06
description: An overview of OSINT techniques in web reconnaissance, including search engine discovery, Google Dorking, and the use of web archives like the Wayback Machine to uncover hidden and historical website data.
image: /images/posts/img_1NF0-G4TH3R/Img_OSINT&WebArchives/Search-Engines.jpg.webp
tags: [OSINT, Google Dorking, Web Archives]
category: Information-Gathering Series
draft: false
pinned: false
comment: true
lang: ar
---

# Search Engine Discovery 

<div dir="rtl">

بص يسيدي هو الفكرة هنا ببساطة إن الـ search engine مش معمولة بس علشان إنك تدور علي معلومة وتنين أو شوية معلومات عادية, لا دي كمان بتعتبر حاجة مهمة لو هتستخدمها في الـ web reconnaissance and information gathering. 

العملية دي إسمها search engine discovery or OSINT (Open Source Intelligence) ودي معناها إنك بتستغل الـ search engine كأداة قوية معاك علشان تقدر تطلع معلومات عن مواقع أو شركات أو حتي أشخاص 

الفكرة الأساسية فيها هي إنك بتستغل قوة خوارزميات البحث علشان توصل لبيانات مش ظاهرة بشكل مباشر علي الموقع بإنك بتستخدم شوية search operators, techniques, and tools تخليك تقدر توصل وتغوص جوه indexed web وتطلع منها معلومات زي 

- employee information
- sensitive documents 
- hidden login pages 
- exposed credentials

</div>

--- 

## Search Operators

<div dir="rtl">

الـ Search operators تعتبر كأنها secret codes خاصة بالـ search engines والأوامر والعلامات دي بتديك مستوي أعلي من الدقة والتحكم وبتخليك توصل لأنواع محددة جداً من المعلومات وسط الكم الكبير من البيانات الموجودة علي الإنترنت 

> ممكن طريقة كتابتها تختلف من search engines للتاني بس الفكرة الأساسية واحدة.

</div>

### Let's delve into some essential and advanced search operators:

 | Operator | Operator Description | Example | Example Description |
|----------|----------------------|---------|---------------------|
| `site:` | Limits results to a specific website or domain. | `site:example.com` | Find all publicly accessible pages on example.com. |
| `inurl:` | Finds pages with a specific term in the URL. | `inurl:login` | Search for login pages on any website. |
| `filetype:` | Searches for files of a particular type. | `filetype:pdf` | Find downloadable PDF documents. |
| `intitle:` | Finds pages with a specific term in the title. | `intitle:"confidential report"` | Look for documents titled "confidential report" or similar variations. |
| `intext:` or `inbody:` | Searches for a term within the body text of pages. | `intext:"password reset"` | Identify webpages containing the term “password reset”. |
| `cache:` | Displays the cached version of a webpage (if available). | `cache:example.com` | View the cached version of example.com to see its previous content. |
| `link:` | Finds pages that link to a specific webpage. | `link:example.com` | Identify websites linking to example.com. |
| `related:` | Finds websites related to a specific webpage. | `related:example.com` | Discover websites similar to example.com. |
| `info:` | Provides a summary of information about a webpage. | `info:example.com` | Get basic details about example.com, such as its title and description. |
| `define:` | Provides definitions of a word or phrase. | `define:phishing` | Get a definition of "phishing" from various sources. |
| `numrange:` | Searches for numbers within a specific range. | `site:example.com numrange:1000-2000` | Find pages on example.com containing numbers between 1000 and 2000. |
| `allintext:` | Finds pages containing all specified words in the body text. | `allintext:admin password reset` | Search for pages containing both "admin" and "password reset" in the body text. |
| `allinurl:` | Finds pages containing all specified words in the URL. | `allinurl:admin panel` | Look for pages with "admin" and "panel" in the URL. |
| `allintitle:` | Finds pages containing all specified words in the title. | `allintitle:confidential report 2023` | Search for pages with "confidential," "report," and "2023" in the title. |
| `AND` | Narrows results by requiring all terms to be present. | `site:example.com AND (inurl:admin OR inurl:login)` | Find admin or login pages specifically on example.com. |
| `OR` | Broadens results by including pages with any of the terms. | `"linux" OR "ubuntu" OR "debian"` | Search for webpages mentioning Linux, Ubuntu, or Debian. |
| `NOT` | Excludes results containing the specified term. | `site:bank.com NOT inurl:login` | Find pages on bank.com excluding login pages. |
| `*` (wildcard) | Represents any character or word. | `site:socialnetwork.com filetype:pdf user* manual` | Search for user manuals (user guide, user handbook) in PDF format on socialnetwork.com. |
| `..` (range search) | Finds results within a specified numerical range. | `site:ecommerce.com "price" 100..500` | Look for products priced between 100 and 500 on an e-commerce website. |
| `" "` (quotation marks) | Searches for exact phrases. | `"information security policy"` | Find documents mentioning the exact phrase "information security policy". |
| `-` (minus sign) | Excludes terms from the search results. | `site:news.com -inurl:sports` | Search for news articles on news.com excluding sports-related content. |

---

## Google Dorking

<div dir="rtl">

بص الـ Google Dorking (أو اللي بيتقال عليها Google Hacking) هو تكنيك بيعتمد علي إستخدام search operators بشكل ذكي علشان توصل لـ

- sensitive information 
- security vulnerabilities 
- hidden content on websites

بإستخدام Google Search

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

### Here are some common examples of Google Dorks

1. Finding Login Pages: 

-`site:example.com inurl:login`

- `site:example.com (inurl:login OR inurl:admin)`


2. Identifying Exposed Files: 

- `site:example.com filetype:pdf`

- `site:example.com (filetype:xls OR filetype:docx)`


3.Uncovering Configuration Files: 

- `site:example.com inurl:config.php`

- `site:example.com (ext:conf OR ext:cnf)` (searches for extensions commonly used for configuration files)

4. Locating Database Backups: 

- `site:example.com inurl:backup`

- `site:example.com filetype:sql`

---

# Web Archives 

<div dir="rtl">

أداة Wayback Machine بتديك فرصة كويسة إنك ترجع بالزمن وتشوف موقع معين كان عامل ازاي زمان, وتستكشف الـ digital footprints بتاعت الموقع زي ما كانت بالظبط 

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

## What is the Wayback Machine?

<img src="/images/posts/img_1NF0-G4TH3R/Img_OSINT&WebArchives/wayback.png" alt="Wayback Machine" />

<div dir="rtl">

الـ Wayback Machine هو digital archive للـ World Wide Web and other information on the Internet.

الأداة دي تابعة لمنظمة غير ربحية إسمها  Internet Archive وبدأت تعمل Archive للمواقع سنة 1996

الأداة دي ببساطة بتسمحلك تـ "go back in time" وتشوف شكل أي موقع كان عامل إزاي في أوقات مختلفة من تاريخه والنسخ دي إسمها snapshots واللي معروفة بردو بـ captures or archives ودول بيدوك نظرة علي النسخ القديمة من الموقع زي design, content, and functionality

</div>

---

### How Does the Wayback Machine Work?

<div dir="rtl">

الـ Wayback Machine بيعتمد علي إستخدام الـ web crawlers علشان ياخد snapshots من المواقع بشكل تلقائي وعلي فترات منتظمة 

الـ crawlers دي بتلف علي الإنترنت وتتنقل بين اللينكات وتعمل indexing للصفحات, شغلتها وطريقة العمل بتاعتها بتشبه جداً search engine crawlers بس الفرق هنا إن هو بدل ما يعمل indexing علشان البحث بس, الـ Wayback Machine بيخزن نسخة كاملة من الصفحة بكل تفاصيلها زي HTML, CSS, JavaScript, images, and other resources

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

 **The Wayback Machine's operation can be visualized as a three-step process:**

<img src="/images/posts/img_1NF0-G4TH3R/Img_OSINT&WebArchives/Step_Process.png" alt="three-step process" />

1. `Crawling`:

<div dir="rtl">

الـ Wayback Machine بتستخدم web crawlers بشكل تلقائي علشان تتصفح الإنترنت بطريقة منظمة, البوتات دي بتمشي من صفحة للتانية عن طريق اللينكات (زي ما انت بتدوس علي hyperlinks وانت بتتصفح موقع) بس بدل ما تقرأ المحتوي بس هي بتنزل نسخة كاملة من كل صفحة تقابلها

</div>

2. `Archiving`:

<div dir="rtl">

الصفحات اللي نزلت جي مع كل الـ resources المرتبطة بيها زي (images, stylesheets, and scripts) بتتخزن في archive ضخم, كل صفحة بيكون ليها تاريخ ووقت محدد وده بيعمل snapshot يمثل شكل الموقع في اللحظة دي 

عملية الأرشفة دي بتبق sometimes daily, weekly, or monthly وده بيعتمد علي شهرة الموقع وقد إيه بيتحدث 

</div>

3. `Accessing`:

<div dir="rtl">

المستخدمين يقدرو يوصلو للـ snapshots دي من خلال Wayback Machine's interface.

كل اللي عليك إنك تحط URL الموقع وتختار تاريخ معين وساعتها تقدر تشوف الموقع كان شكله إزاي وقتها وكمان تقدر تتصفح صفحات معينة من الأرشيف, تدور علي كلمات داخل المحتوي القديم, تنزل نسخة كاملة من الموقع علشان تعمل offline analysis.

<p style="text-align: center;"><strong>. . .</strong></p>

معدل الأرشفة في الـ Wayback Machine بيختلف من موقع للتاني, في مواقع ممكن تتأرشف كذا مرة في اليوم وفي مواقع تانية ممكن تلاقي ليها snapshots قليلة جداً متوزعة علي سنين لأن في عوامل بتأثر علي عدد مرات الأرشفة منها شهرة الموقع, معدل التغيير أو التحديث فيه, الموارد المتاحة عند  Internet Archive

> الـ Wayback Machine مش بيأرشف كل صفحة علي الإنترنت هو بيركز أكتر علي websites deemed to be of cultural, historical, or research value

</div>

---

## Why the Wayback Machine Matters for Web Reconnaissance

<div dir="rtl">

الـ Wayback Machine يعتبر من الحاجات المهمة في سيناريوهات مختلفة وأهميته بتيجي من قدرته إنه يكشفل كماضي الموقع ويديك insights مش واضحة في النسخة الحالية ومنهم:

</div>

1. `Uncovering Hidden Assets and Vulnerabilities`:

<div dir="rtl">

الـ Wayback Machine بيسمحلك تكتشف old web pages, directories, files, or subdomains ممكن تكون مش متاحة دلوقتي وده ممكن يكشف عن sensitive information or security flaws

</div>

2. `Tracking Changes and Identifying Patterns`:

<div dir="rtl">

وأنت بتقارن الـ snapshots القديمة بالموقع الحالي تقدر تلاحظ إزاي الموقع إتطور مع الوقت وده بيكشف تغييرات في الـ  structure, content, technologies, and potential vulnerabilities

</div>

3. `Gathering Intelligence`:

<div dir="rtl"> 

المحتوي المؤرشف ممكن يكون مصدر مهم للـ OSINT ويديك insights عن target's past activities, marketing strategies, employees, and technology choices

</div>

4. `Stealthy Reconnaissance`:

<div dir="rtl">

الوصول للـ snapshots القديمة يعتبر passive recon يعني مش بيحصل تفاعل مباشر مع التارجت وده بيخليه less detectable way to gather information

</div>
