---
title: HTB | 1NF0-G4TH3R – Crawling
published: 2026-05-04
description: A practical introduction to web crawling for reconnaissance, covering crawler behavior, robots.txt, .well-known URLs, crawling strategies, and extracting valuable data from target websites.
image: /images/posts/img_1NF0-G4TH3R/img_Crawling/Crawling.jpg
tags: [Web Crawling, Well-Known URLs, robots.txt, Scrapy]
category: Information-Gathering Series
draft: false
pinned: false
comment: true
lang: ar
---

# Crawling

<div dir="rtl">

الـ `Crawling` أو `spidering` هو `automated process of systematically browsing the World Wide Web` 

الـ web crawler بإختصار هو بيمشي ورا اللينكات من صفحة للتانية ويجمع داتا, الـ crawlers في الأساس هو عبارة عن bots شغالة بألجويرزم معين هدفها إنها تكتشف وتعمل indxing للصفحات علشان تساعدك إنك توصل لها من خلال الـ search engines أو تستخدمها لغرض تاني زي data analysis and web reconnaissance.

</div>

---

## How Web Crawlers Work

<div dir="rtl">

الـ web crawler فكرته وطريقة شغله بسيطة بس قوية جداً في التطبيق 

الـ web crawler بيبدأ بحاجة اسمها seed URL وده أول صفحة هيبدأ منها بعدها بيعمل fetch للصفحة دي وبعد كده بيعملها parsing ويستخرج كل اللينكات اللي فيها واللينكات دي بيحطها في queue وبعدها بيبدأ يعمل crawling عليهم واحد واحد ويكرر نفس العملية بشكل iterative حسب الـ scope and configuration 

</div>

1. `Homepage`: You start with the homepage containing `link1`, `link2`, and `link3`.

```txt
Homepage
├── link1
├── link2
└── link3
```

2. `Visiting link1`: Visiting `link1` shows the homepage, `link2`, and also `link4` and `link5`.

```txt
link1 Page
├── Homepage
├── link2
├── link4
└── link5
```

3. `Continuing the Crawl`: The crawler continues to follow these links systematically, gathering all accessible pages and their links.

<div dir="rtl">

المثال ده بيوضع إن الـ crawler بيعتمد علي تتبع اللينكات بشكل systematically علشان يجمع المعلومات وده يفرق عن الـ fuzzing اللي بيعتمد علي تخمين لينكات أو path محتملة 

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

1. seed URL 

<div dir="rtl">

ده ببساطة نقطة البداية بتاعتك يعني هو أول لينك الـ crawler بيبدأ منه الشغل 

</div>

2. fetch 

<div dir="rtl">

دي خطوة إنك تجيب الصفحة نفسها يعني الـ crawler بيبعت request ( زي ما المتصفح بيعمل ) علشان يحمل محتوي صفحة (HTML)

</div>

3. parsing

<div dir="rtl">

بعد ما جبت الصفحة (HTML) تيجي بق مرحلة الـ Analysis الـ crawler بيحلل الكود ويطلع منه الحاجات المهمة زي الـ 
- links
- comments
- scripts

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

---

## There are two primary types of crawling strategies.

### Breadth-First Crawling

<img src="/images/posts/img_1NF0-G4TH3R/img_Crawling/BreadthCrawling.png" alt="Breadth-First Crawling" />

<div dir="rtl">

الـ `Breadth-first crawling` بيهتم إنه يشتغل علي الـ width بتاع الموقع قبل ما يدخل في الـ depth 
هو هنا بيبدأ من الـ seed URL ويعمل crawling علي كل اللينكات الموجودة في الصفحة وبعد كده ينتقل للينكات اللي في الصفحات دي وهكذل 

الفكرة إنه بيشتغل level by level وده بيبق مفيد لو عايز تاخد نظرة عامة عن الـ structure والمحتوي بتاع الموقع نفسه 

</div>

### Depth-First Crawling

<img src="/images/posts/img_1NF0-G4TH3R/img_Crawling/DepthCrawling.png" alt="Depth-First Crawling" />

<div dir="rtl">

علي العكس هنا بق الـ `depth-first crawling` بيركز اكتر علي الـ depth اكتر من الـ width يعني بيتبع مسار واحد من اللينكات لحد ما يوصل لأخر حاجة فيه وبعد كده بيعمل backtracking ويرجع يستكشف مسارات تانية 

وده بيبق مفيد لو الهدف بتاعك إنك توصل لمحتوي specific أو إنك تتعمق أوي في أجزاء معينة في الموقع 

> إختيار الـ strategy بيعتمد علي الهدف من عملية الـ crawling 

لو مفهمتش كويس الجزء اللي فات ركز معايا في الكلام اللي جاي وهنفهم الفرق بين الـ two strategy كويس 

<p style="text-align: center;"><strong>. . .</strong></p>

**الإتنين بيبدأو من الـ seed URL بس الفرق بينهم ببساطة بيتمثل في طريقة التتبع بتاعتهم :**

1. الـ Depth-First Crawling بيبدأ من الـ seed URL يلاقي أول لينك ويخش عليه وبيكمل في نفس المسار لحد ما يوصل لنهاية اللينكات ومفيش حاجات جديدة يقدر يدخل عليها ساعتها بيرجع يعمل backtracking ويروح علي لينك تاني من نفس مستوي الـ seed URL ويكمل بنفس الطريقة


 2. الـ Breadth-first crawling هو بيبدأ من الـ seed URL يلاقي مثلاً خمس لينكات بيخش علي اللينك الأول يعمل crawling يجيب اللينكات اللي فيه وبعدين يطلع ويرجع يخش علي اللينك التاني ويعمل crawling.... وهكذا بق 

وبعد ما يخلص كل اللينكات اللي في نفس الـ level (اللي هما الخمس لينكات) يبدأ يخش علي اللينكات اللي جواهم ويكمل بنفس الطريقة level_by_level

</div>

---

## Extracting Valuable Information

<div dir="rtl">

الـ crawlers تقدر تستخرج مجموعة متنوعة من البيانات وكل نوع منها له هدف في عملية لـ reconnaissance 

</div>

- `Links (Internal and External)`: These are the fundamental building blocks of the web, connecting pages within a website (`internal links`) and to other websites (`external links`). Crawlers meticulously collect these links, allowing you to map out a website's structure, discover hidden pages, and identify relationships with external resources.

- `Comments`: Comments sections on blogs, forums, or other interactive pages can be a goldmine of information. Users often inadvertently reveal sensitive details, internal processes, or hints of vulnerabilities in their comments.

- `Metadata`: Metadata refers to `data about data`. In the context of web pages, it includes information like page titles, descriptions, keywords, author names, and dates. This metadata can provide valuable context about a page's content, purpose, and relevance to your reconnaissance goals.

- `Sensitive Files`: Web crawlers can be configured to actively search for sensitive files that might be inadvertently exposed on a website. This includes `backup files` (e.g., .bak, .old), `configuration files` (e.g., web.config, settings.php), `log files` (e.g., error_log, access_log), and other files containing passwords, `API keys`, or other confidential information. Carefully examining the extracted files, especially backup and configuration files, can reveal a trove of sensitive information, such as `database credentials`, `encryption keys`, or even source code snippets.

<div dir="rtl">

> كل معلومة لوحدها ممكن تبان عادية بس القيمة الحقيقية من البيانات اللي انت بستخرجها أو بتطلعها بتظهر لما تربطها بمعلومات تانية context surrounding

</div>

---

# robots.txt

<div dir="rtl">

تخيل إنك ضيف في حفلة كبيرة جوة قصر إنت بتق حر تتحرك وتستكشف المكان بس في نفس الوقت بيبق في أوض متعلق عليها مثلاً يافطة مكتوب عليها ممنوع الدخول أو private فالمفروض متخدلهاش 

نفس الفكرة دي بالظبط بتطبق علي ملف robots.txt في عالم الـ web crawling الملف ده بيشتغل كأنه `etiquette guide` للـ bots فبيحدد لهم إي الصفحات أو المسارات المسموح إنهم يوصلو ليها وإيه اللي ممنوع يدخلو عليه 

</div>

---

## What is robots.txt?

<div dir="rtl">

Technically, robots.txt هو simple text file عادي جداً مكانه بيبق في الـ root directory بتاع الموقع زي مثلاً `www.example.com/robots.txt` 

من الناحية التقنية الفايل ده ماشي حسب حاجة إسمها Robots Exclusion Standard ودي عبارة عن مجموعة قواعد بتحدد الـ bots أو الـ web crawlers المفروض تتصرف إزاي وهي بتزور الموقع 

جوة الفايل ده بيكون فيه "`directives`" ودي بتبق عبارة عن أوامر والأوامر دي بتقول للـ bots إيه الأجزاء أو الصفحات اللي مسموح لها تعملها crawl وإيه اللي ممنوع أو من المفروض تتجنبه 

</div>

---

### How robots.txt Works

<div dir="rtl">

الـ directives اللي موجودة في robots.txt غالباً يعني بتستهدف user-agents ودي عبارة عن identifiers لأنواع مختلفة من الـ bots 

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

**For example, a directive might look like this:**

```txt
User-agent: *
Disallow: /private/
```

<div dir="rtl">

الأمر ده معناه كل الـ user-agents (`*` is a wildcard) ممنوع عليهم الوصول لأي URLs بيبدأ بـ `/private/` **كمان فيه أوامر تانية ممكن تستخدمها**
- تسمح بالوصول لأجزاء معينة من الموقع 
- تحدد وقت تأخير بين كل request والتاني علشان تقلل الضغط علي السيرفر 
- تضيف لينك الـ sitemaps علشان تساعد البوتات إنها تعمل crawling بشكل أحسن 

</div>

---

### Understanding robots.txt Structure

<div dir="rtl">

ملف robots.txt هو plain text عادي وبيكون موجود في الـ root directory بتاع الموقع 

الـ structure بتاعه سهل وبسيط كل مجموعة "record" بتكون مفصولة عن التانية بسطر فاضي

</div>


**Each record consists of two main components:**  

1. `User-agent`: This line specifies which crawler or bot the following rules apply to. A wildcard (`*`) indicates that the rules apply to all bots. Specific user agents can also be targeted, such as "Googlebot" (Google's crawler) or "Bingbot" (Microsoft's crawler).

2. `Directives`: These lines provide specific instructions to the identified user-agent.

<p style="text-align: center;"><strong>. . .</strong></p>

**Common directives include:**

| **Directive**      | **Description**                                                                 | **Example**                                                                 |
|----------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `Disallow`     | Specifies paths or patterns that the bot should not crawl.                  | `Disallow: /admin/` (disallow access to the admin directory)           |
| `Allow`        | Explicitly permits the bot to crawl specific paths or patterns, even if they fall under a broader `Disallow` rule. | `Allow: /public/` (allow access to the public directory) |
| `Crawl-delay`  | Sets a delay (in seconds) between successive requests from the bot to avoid overloading the server. | `Crawl-delay: 10` (10-second delay between requests) |
| `Sitemap`      | Provides the URL to an XML sitemap for more efficient crawling.             | `Sitemap: https://www.example.com/sitemap.xml`                         |


---

### Why Respect robots.txt?

<div dir="rtl">

مع إن ملف robots.txt مش إلزامي 100% (أي بوت خبيث ممكن يتجاهله) لكن أغلب الـ web crawlers and search engine bots بتلتزم بالتعليمات اللي فيه وده مهم لشوية أسباب :

</div>

- `Avoiding OverBurdening Servers`: 

<div dir="rtl">

لما بتحدد أجزاء معينة البوتات ما تدخلهاش بتقلل عدد الـ requests وده بيمنع الـ traffic الزايد اللي ممكن يبطأ الموقع أو السيرفر 

</div>

- `Protecting Sensitive Information`:

<div dir="rtl">

تقدر تستخدم robots.txt علشان تمنع الـ search engines من إنها تعمل indexed لبيانات خاصة أو سرية زي صفحات داخلية أو admin panels 

</div>

- `Legal and Ethical Compliance`:

<div dir="rtl">

تجاهل تعليمات robots.txt ممكن يعتبر مخالفة لشروط إستخدام الموقع وده ممكن يشبب مشاكل قانونية خصوصاً لو فيه accessing copyrighted or private data

</div>

---

###  robots.txt in Web Reconnaissance

<div dir="rtl">

في الـ web reconnaissance ملف robots.txt بيعتبر مصدر مهم لأنك تقدر تطلع منه insights مهمة عن الموقع والـ structure and potential vulnerabilities of a target website :

</div>

- `Uncovering Hidden Directories`:

<div dir="rtl">

المسارات اللي معمولها Disallowed غالباً صاحب الموقع مش عايزها تظهر في الـ search engine crawlers 

بالنسبة ليك انت بق الأماكن دي مهمة لأنها بتحتوي علي:


- sensitive information 
- backup files 
- administrative panels 
- other resoures that could interest an attacker

</div>

- `Mapping Website Structure`:

<div dir="rtl">

لما بتبدأ تحلل الـ allowed and disallowed paths, تقدر ترسم تصور مبدئي لـ structure الموقع وده ممكن يكشف صفحات أو أجزاء مش مرتبطة مع الـ main navigation, potentially leading to undiscovered pages or functionalities.

</div>

- `Detection Crawler Traps`: 

<div dir="rtl">

في بعض المواقع بتحط مسارات وهمية في "honeypot" directorites in robots.txt علشان توقع الـ malicious bots فـ إنت لو قدرت تلاحظ الكلام ده فساعتها هتبدأ تاخد فكرة عن مستوي الوعي الأمني عند الموقع والإجراءات الدفاعية المستخدمة

</div>

---

### Analyzing robots.txt

Here's an example of a robots.txt file:

```txt
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

User-agent: Googlebot
Crawl-delay: 10

Sitemap: https://www.example.com/sitemap.xml
```
<p style="text-align: center;"><strong>. . .</strong></p>

This file contains the following directives:

- All user agents are disallowed from accessing the `/admin/` and `/private/` directories.

- All user agents are allowed to access the `/public/` directory.

- The `Googlebot` (Google's web crawler) is specifically instructed to wait 10 seconds between requests.

- The sitemap, located at `https://www.example.com/sitemap.xml`, is provided for easier crawling and indexing.

> By analyzing this robots.txt, we can infer that the website likely has an admin panel located at `/admin/` and some private content in the `/private/` directory.


---

# Well-known URLs

The `.well-known` standard, defined in RFC 8615 

<div dir="rtl">

فكرته إنه يعمل directory ثابت جوة الـ website's root domain وبيبق علي مسار
`/well-known./`
 وده بيتحط فيه كل الـ

- critical metadata 
- including configuration files 
- information related to its services 
- protocols 
- security mechanisms


من خلال توفير مكان ثابت وموجود لمثل هذه البيانات, يقوم .well-known بتبسيط عملية اكتشافها والوصول إليها لمختلف الجهات, بما في ذلك web browsers, applications, and security tools. 

الميزة دي بتسمح للـ clients إنه يقدر يوصل للمعلومات دي بسهولة لأنه عارف مكانها قبل من كده فمثلاً لو عايز تجيب الـ security policy هتطلب `https://example.com/.well-known/security.txt`

</div>

<p style="text-align: center;"><strong>. . .</strong></p>

<div dir="rtl">

الـ `Internet Assigned Numbers Authority` (`IANA`) هي اللي بتدير registry الخاص بـ Well-Known URLs دي وكل واحد ليه إستخدام محدد ومعتمد رسمياً 

</div>

## a few notable examples:

| URI Suffix | Description | Status | Reference |
|-------------|-------------|---------|------------|
| `security.txt` | Contains contact information for security researchers to report vulnerabilities. | Permanent | RFC 9116 |
| `/.well-known/change-password` | Provides a standard URL for directing users to a password change page. | Provisional | `https://w3c.github.io/webappsec-change-password-url/#the-change-password-well-known-uri` |
| `openid-configuration` | Defines configuration details for OpenID Connect, an identity layer on top of the OAuth 2.0 protocol. | Permanent | `http://openid.net/specs/openid-connect-discovery-1_0.html` |
| `assetlinks.json` | Used for verifying ownership of digital assets (e.g., apps) associated with a domain. | Permanent | `https://github.com/google/digitalassetlinks/blob/master/well-known/specification.md` |
| `mta-sts.txt` | Specifies the policy for SMTP MTA Strict Transport Security (MTA-STS) to enhance email security. | Permanent | RFC 8461 |


---


# Creepy Crawlies

<div dir="rtl">

الـ Web crawling موضوع كبير ومعقد بس مش لازم تدخل فيه لوحدك, فيه عدد كبير من الـ web crawling tools اللي بتساعدك في العملية دي وكل أداة ليها مميزاتها وإستخداماتها الخاصة 

الأدوات دي بتعمل automate the crawling process وده بيخليها أسرع وأكثر كفاءة وبالتالي تقدر تركز أكتر علي analyzing the extracted data بدل ما تضيع وقتك في عملية الإستخراج نفسها 

</div>

## Popular Web Crawlers

1. `Burp Suite Spider`: Burp Suite, a widely used web application testing platform, includes a powerful active crawler called Spider. Spider excels at mapping out web applications, identifying hidden content, and uncovering potential vulnerabilities.

2. `OWASP ZAP (Zed Attack Proxy)`: ZAP is a free, open-source web application security scanner. It can be used in automated and manual modes and includes a spider component to crawl web applications and identify potential vulnerabilities.

3. `Scrapy (Python Framework)`: Scrapy is a versatile and scalable Python framework for building custom web crawlers. It provides rich features for extracting structured data from websites, handling complex crawling scenarios, and automating data processing. Its flexibility makes it ideal for tailored reconnaissance tasks.

4. `Apache Nutch (Scalable Crawler)`: Nutch is a highly extensible and scalable open-source web crawler written in Java. It's designed to handle massive crawls across the entire web or focus on specific domains. While it requires more technical expertise to set up and configure, its power and flexibility make it a valuable asset for large-scale reconnaissance projects.

<p style="text-align: center;"><strong>. . .</strong></p>

### Scrapy 

<div dir="rtl">

هنستخدم أداة scrapy مع spider معمول مخصوص لأعمال الـ reconnaissance علي موقع زي `inlanefreight.com` 

</div>


```bash
AbuEIOyun1@kalil[~]$ python3 ReconSpider.py http://inlanefreight.com
```

<div dir="rtl">

في الأمر ده الـ spider هيبدأ يعمل crawling علي الموقع ويجمع valuable information

</div>

#### results.json

<div dir="rtl">

بعد ما تشغل `ReconSpider.py` البيانات اللي إتجمعت بتتخزن في JSON file إسمه results.json تقدر تفتحه بأي text editor 

</div>

**Below is the structure of the JSON file produced:**

```json
{
    "emails": [
        "lily.floid@inlanefreight.com",
        "cvs@inlanefreight.com",
        ...
    ],
    "links": [
        "https://www.themeansar.com",
        "https://www.inlanefreight.com/index.php/offices/",
        ...
    ],
    "external_files": [
        "https://www.inlanefreight.com/wp-content/uploads/2020/09/goals.pdf",
        ...
    ],
    "js_files": [
        "https://www.inlanefreight.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.3.2",
        ...
    ],
    "form_fields": [],
    "images": [
        "https://www.inlanefreight.com/wp-content/uploads/2021/03/AboutUs_01-1024x810.png",
        ...
    ],
    "videos": [],
    "audio": [],
    "comments": [
        "<!-- #masthead -->",
        ...
    ]
}
```

Each key in the JSON file represents a different type of data extracted from the target website:

| JSON Key | Description |
|-----------|-------------|
| `emails` | Lists email addresses found on the domain. |
| `links` | Lists URLs of links found within the domain. |
| `external_files` | Lists URLs of external files such as PDFs. |
| `js_files` | Lists URLs of JavaScript files used by the website. |
| `form_fields` | Lists form fields found on the domain (empty in this example). |
| `images` | Lists URLs of images found on the domain. |
| `videos` | Lists URLs of videos found on the domain (empty in this example). |
| `audio` | Lists URLs of audio files found on the domain (empty in this example). |
| `comments` | Lists HTML comments found in the source code. |


> By exploring this JSON structure, you can gain valuable insights into the web application's architecture, content, and potential points of interest for further investigation.
