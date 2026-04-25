---
title: HTB | 1NF0-G4TH3R – Subdomain Enumeration
published: 2026-04-26
description: subdomain
image: /images/posts/img_1NF0-G4TH3R/Subdomain/subdomain_enumeration2.png
tags: [subdomains]
category: 1NF0-G4TH3R Series
draft: false
pinned: false
comment: true
lang: ar
---

# subdomains

<div dir="rtl">
 
وإحنا بنستكشف الـ DNS Records كنا مركزين بشكل أساسي علي الـ main domain زي `example.com` وكل المعلومات المرتبطة بيه
بس في الحقيقة تحت الدومين الأساسي ده في ` potential network subdomains`

الـ subdomains دي عبارة عن extension للـ main domain وغالباً بتستخدم علشان تعمل تنظيم وتقسيم لأجزاء أو functionalities مختلفة جوة الموقع<dev dir="rtl">
 
يعني مثلاً:

`blog.example.com` للـ blog بتاعتهم 

`shop.example.com` للـ online store

`mail.example.com` للـ email 

</div>

---

## Why is this important for reconnaissance?

<div dir="rtl">

ليه ده مهم في الـ web reconnaissance 
الـ subdomains الكتير بيكون عليها معلومات و resources مهمة ومش بتكون مرتبطة بشكل مباشر من الـ main website 

وده ممكن يشمل:

</div>

### - Development

<div dir="rtl">

الشركات بتستخدم subdomain علشان تجرب features أو updates قبل ما تنزلها في الـ main website 

> الأماكن دي أحياناً بيكون فيها security أقل فممكن تلاقي vulnerabilities أو معلومات حساسة 

</div>

### - Hidden Login Portals 

<div dir="rtl">

ممكن تلاقي `admin panels` أو صفحات `login` مش معمولة علشان تبقي public ودي بتكون targets مغرية لأي attacker

</div>

### - Legacy Applications 

<div dir="rtl">

ساعات بيكون فيه web applications قديمة ومنسية شغالة علي subdomains وغالباً بتكون outdated وفيها vulnerabilities معروفة 

</div>

### - Sensitive Information

<div dir="rtl">

ممكن subdomains تكشف بالغلط عن معلومات أو ملفات حساسة أو `internal data` أو `configuration files`

</div>

---

## Subdomain Enumeration

<div dir="rtl">

الـ `subdomain enumeration` هو عمليةإنك بشكل systematic تحاول تحدد وتجمع كل الـ subdomains اللي تبع الدومين 

من ناحية الـ DNS الـ Subdomains غالباً بتكون عبارة عن :
- A records أو (AAAA لو IPv6) ودي بتعمل mapping بين اسم الـ subdomains والـ IP Address

- CNAME ودي بتستخدم علشان تعمل alias للـ subdomain وتخليه يشاور علي domain أو subdomain تاني 

</div>

### There are two main methods for subdomain enumeration.

#### 1. Active Subdomain Enumeration

<div dir="rtl">

دي بتعتمد إنك تتعامل بشكل مباشر مع الـ DNS Server بتاعت الـ targets علشان تطلع منها الـ subdomains ودي فيها طرق زي: 


- DNS Zone transfer


لو السيرفر فيه Misconfigured ممكن يسرب لك list كاملة بكل الـ subdomains 
> بس بسبب إن الـ Security measures بقت أقوي الموضوع بق نادر جداً 


- brute-force enumeration 


ودي إنك بشكل systematically تجرب list من subdomain name محتملة علي الدومين

Tools Like : `dnsenum`, `ffuf`, `gobuster`

الأدوات دي بيعملو العملية دي اوتوماتيك بإستخدام wordlists فيها أسماء شائعة أو lists متولدة حسب patterns معينة 

</div>

#### 2. passive enum 

<div dir="rtl">

دي بتعتمد علي مصادر خارجية علشان تكتشف subdomains من غير ما تعمل direct queries علي DNS بتاع التارجت 
من أهم المصادر:


- **`Certificate Transparency (CT) logs`**


ودي عبارة عن public repositories فيها `SSL/TLS certificates` وغالباً بيكون فيها list من الـ subdomains في الـ SAN (SUBJECT ALTERNATIVE NAME)

> وده بيعتبر treasure trove من الـ targets


- كمان تقدر تستخدم search engines زي google & Duck Duck Go بإستخدام search operators زي `site:` علشان تطلع results فيها subdomains بس

- في `online database & tools` بتجمع DNS data من مصادر مختلفة وتقدر تبحث فيها من غير م تتعامل مباشرة مع التارجت

</div>

---

# Subdomain Bruteforcing

<div dir="rtl">

الـ Subdomain Brute-Force Enumeration تعتبر من أقوي technique الـ Active subdomain discovery وبتعتمد علي إستخدام pre-defined lists من أسماء subdomains محتملة

الفكرة هنا إنك بشكل systematic بتجرب الأسماء دي علي الـ Target domain علشان تحدد أي اللي فيهم valid subdomains 

وبإستخدام wordlists متظبطة كويس تقدر تزود `effectiveness` و `efficiency` لعملية الـ subdomains discovery 

</div>

## The process breaks down into four steps 

### 1. Wordlist Selection :

<div dir="rtl">

أول حاجة بتبدأ بيها العملية دي هي إنك تختار wordlists تحتوي علي subdomain names  

</div>

**And this wordlist can be… :**

<div dir="rtl">
 
- **General-Purpose :**



فيها مجموعة كبيرة من الـ subdomain names الشائعة زي مثلاً :
(dev, staging, blog, main, admin, test)
ودي بتبق مفيدة لو إنت مش عارف الـ Namin Conventions بتاعت التارجت 


- **Targeted :**


بتكون مركزة علي industry أو technology أو patterns معينة ليها علاقة بالتارجت 
> دي أكثر كفاءة وبتقلل الـ false positives 


- **Custom :**


تقدر تعمل wordlist بنفسك بناء علي key words أو patterns أو معلومات جمعتها من مصادر تانية 

</div>

### 2. Iteration and Querying :

<div dir="rtl">

هنا الـ Tool بيعمل iterate علي الـ wordlist وبيضيف كل كلمة أو phrase علي الـ main domain (example.com) علشان يكَون subdomains محتملة زي :
- dev.example.com
- staging.example.com

</div>

### 3. DNS Lookup :

<div dir="rtl">

لكل subdomain محتمل بيتعمل DNS Query علشان نتأكد هل بيعمل resolve لـ IP address ولا لا ‫وغالباً ده بيتم بإستخدام `A` or `AAAA` record type‬

إزاي ده بيحصل :

لما يكون عندك subdomain زي dev.example.com الـ tool بيعمل DNS Query يعني بيروح للـ Dns Server وبيقوله **هاتلي الـ ip بتاع dev.example.com**

- لو الـ subdomain موجود السيرفر بيرد :
`dev.example.com` --> `192.168.1.10`
هنا بنقول ده عمل resolve يعني موجود وليه IP 

- لو مش موجود السيرفر بيرد بحاجة زي :
`NXDOMAIN`
يعني الـ subdomain ده مش موجود أصلاً

</div>

### 4. Filtering and Validation :

<div dir="rtl">

لو الـ subdomain عمل resolve بنجاح يعني رجع IP address بيتضاف في list بتاعة valid subdomains بس الموضوع مش بيقف هنا لأن بعد كده بنعمل validation زيادة علشان نتأكد 
- هل الـ subdomain ده موجود فعلاً 
- هل عليه functionality ولا لا
مثلاً عن طريق إنك توصل ليه بإستخدام web browser

</div>

---

## There are several tools available that excel at brute-force enumeration 

| Tool         | Description |
|--------------|------------|
| dnsenum      | Comprehensive DNS enumeration tool that supports dictionary and brute-force attacks for discovering subdomains |
| fierce       | User-friendly tool for recursive subdomain discovery, featuring wildcard detection and an easy-to-use interface |
| dnsrecon     | Versatile tool that combines multiple DNS reconnaissance techniques and offers customisable output formats |
| amass        | Actively maintained tool focused on subdomain discovery, known for its integration with other tools and extensive data sources |
| assetfinder  | Simple yet effective tool for finding subdomains using various techniques, ideal for quick and lightweight scans |
| puredns      | Powerful and flexible DNS brute-forcing tool, capable of resolving and filtering results effectively |

---

## DNSEnum

<div dir="rtl">

الـ `dnsenum` هو Tool مرن ومشهور بيشتغل من الـ command line ومكتوب بـ Perl 
وهو عبارة عن comprehensive toolkit للـ DNS reconnaissance 
يعني بيجمع معلومات عن DNS infrastructure بتاع الدومين وكمان الـ potential subdomains 

</div>

### The tool offers several key functions 

**1. DNS Record Enumeration**

<div dir="rtl">

الـ DNS Enum يقدر يجيب أنواع مختلفة من DNS Records زي 
`A` - `AAAA` - `MX` - `TXT` - `NS`
وده بيديك صورة كاملة عن إعدادات الـ DNS بتاعت التارجت 

</div>

**2. Zone Transfer Attempts**

<div dir="rtl">

الـ Tool بيحاول يعمل zone transfer من الـ Name Servers اللي بيكتشفها, 
في الطبيعي السيرفرات بتكون معمول لها حماية تمنع `unauthorized zone transfers` بس لو نجحت العملية ممكن يطلعلك كمية ضخمة من معلومات الـ DNS 

</div>

**3. Subdomain Brute-Forcing**

<div dir="rtl">

الـ `dnsenum` بيعمل brute-force enumeration للـ subdomains بإستخدام Wordlist 
يعني يبجرب أسماء subdomain محتملة ويشوف إيه اللي فعلاً موجود علي التارجت

</div>

**4. Google Scraping**

<div dir="rtl">

يقدر يعمل scrape لنتائج Google علشان يلاقي subdomains مش ظاهرة مباشرة في الـ DNS Records 

</div>

**5. Reverse Lookup**

<div dir="rtl">

بيعمل reverse DNS lookups يعني بيحول من IP --> Domain
وده ممكن يكشف ليك مواقع تانية شغالة علي نفس السيرفر 

</div>

**6. WHOIS Lookups**

<div dir="rtl">

يقدر يعمل `WHOIS queries` علشان يجيب معلومات عن :
- الـ owner بتاع الدومين 
- بيانات تسجيل الدومين 
- تفاصيل الـ registration

</div>

---

### Let's see `dnsenum` in action

<div dir="rtl">

خلينا نشوف الـ dnsenum وهو شغال بق فعلياً 
احنا هنا هنستخدمه علشان نعمل subdomains enumeration علي تارجت `example.com` 
وفي المثال ده هنستخدم wordlist من Seclists إسمها `top1million-20000.txt` والليست دي فيها top 20000 most common subdomains 

</div>

```bash 
dnsenum --enum example.com -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -r
```
**In this command:** 

<div dir="rtl">

- `dnsenum --enum example.com` 

 هنا بنحدد الـ target domain اللي عايزين نعمله enumeration و `--enum` دي shortcut بتشغل وضع إسمه enum mode يعني بدل ما تشغل كل feature لوحدها، بتشغل كل حاجة مرة واحدة

- `-f /usr/share/seclists/Discovery/DNS/subdomain-top1million-20000.txt`

وده مسار الـ wordlist اللي هنستخدمها في الـ brute-force يعني التولز هتجرب كل الأسماء اللي في الملف ده كـ subdomains محتملة

- `-r` 


دي option ينستخدمها لما تحب تفعل `recursive subdomain brete-forcing`
 
يعني لو الأداة لقت subdomain زي dev.inlanefreight.com

الأداة ساعتها هتبدأ تجرب (`api.`dev.inlanefreight.com ,`test.`dev.inlanefreight.com)

يعني بتكمل عمق أكثر في الإكتشاف

</div>

**output :**

```bash
AbuElOyun1@kali[~]$ dnsenum --enum inlanefreight.com -f  /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt 

dnsenum VERSION:1.2.6

-----   inlanefreight.com   -----


Host's addresses:
__________________

inlanefreight.com.                       300      IN    A        134.209.24.248

[...]

Brute forcing with /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt:
_______________________________________________________________________________________

www.inlanefreight.com.                   300      IN    A        134.209.24.248
support.inlanefreight.com.               300      IN    A        134.209.24.248
[...]


done.
```
---

# DNS Zone Transfers

<div dir="rtl">

رغم إن الـ brute-forcing ممكن يجيب نتيجة كويسة لكن في طريقة تانية (`less invasive`) وساعات بتبق أكبر كفاءة في إكتشاف الـ subdomains وهي الـ DNS zone transfers

الميكانيزم ده معمول أساساً علشان يعمل repliction للـ DNS records بين الـ name servers لكن لو فيه misconfiguration ممكن يتحول لكنز معلومات

</div>

## What is a Zone Transfer

<div dir="rtl">

الـ DNS Zone transfer ببساطة هو إنك تاخد نسخة كاملة من كل الـ DNS records اللي جوة الـ Zone من name server وتنقلها لـ name server تاني 

> العملية دي موجودة أصلاً علشان تحافظ علي الـ consistency & redundancy بين الـ DNS server

المشكلة هنا بتبق إن لو مفيش تأمين كفاية أي حد مش مصرح له ممكن يسحب الـ zone file بالكامل وساعتها يقدر يشوف كل الـ subdomains والـ IP addresses بتاعتها وكمان sensitive DNS data

</div>

## How to zone transfer works

<img src="/images/posts/img_1NF0-G4TH3R/Subdomain/dns_zone_transfers.png" alt="Zone Transfer">

### 1. Zone Transfer Request (AXFR) : 

<div dir="rtl">

الـ secondary server بيبدأ العملية ويبعت request للـ primary server بإستخدام AXFR (Full Zone Transfer )

</div>

### 2. SOA Record Transfer :

<div dir="rtl">

أول ما الـ primary يستقبل الطلب (وساعاات يتأكد من هوية الـ secondary) بيرد ويبعت الـ (SAO) record وده فيه معلومات مهمة عن الـ zone زي الـ serial number علشان الـ secondary يعرف هل البيانات محدثة ولا لا

</div>

### 3. DNS Records Transmission :

<div dir="rtl">

بعد كده الـ primary بيبعت كل الـ DNS Records واحدة واحدة زي 
(A, AAAA, CNAME, MX, NS)
ودل اللي بتحدد الـ subdomain والـ mail server والـ name server وغيره

</div>

### 4. Zone Transfer Complete :

<div dir="rtl">

لما كل الـ records تخلص الـ primary بيعلن إن الـ zone transfer خلص 

</div>

### 5. Acknowledgement (ACK) :

<div dir="rtl">

الـ secondary بيرد برسالة تأكيد (ACK) إنه إستلم وعالج البيانات بنجاح وبكده العملية بتكون إنتهت

</div>

---
 
## The Zone Transfer Vulnerability

<div dir="rtl">

الـ zone transfers حاجة مهمة جداً في إدارة الـ DNS بشكل طبيعي بس لو في أي MISCONFIGURATION في إعدادات الـ DNS server الموضوع ممكن يتحول لثغرة أمنية كبيرة 

> المشكلة الأساسية هنا بتبق في الـ access control يعني مين مسموح له يطلب zone transfer أصلاً 

زمان في بداية الإنترنت كان عادي جداً إن أي client يقدر يطلب zone transfer من الـ DNS server 

الأسلوب ده بيسهل الإدارة بس في  نفس الوقت كان عامل ثغرة كبيرة لأن كده أي حد حتي الـ malicious actors يقدر يطلب نسخة كاملة من الـ zone file واللي بيبقي فيها sensitive information

المعلومات اللي الـ attacker بيطلع بيها من الـ unauthorised zone transfer بتكون مهمة جداً لانها بتديله خريطة كاملة للـ DNS infrastructure بتاع التارجت **وده بيشمل :**

</div>

**1. Subdomains :**

<div dir="rtl">

 ليستة بكل الـ subdomains وفيه مهم كتير بيبق مش ظاهر في الـ main website أو صعب توصله بطرق تانية فممكن تلاقي :
- admin panels
- staging environments
- development servers 
- sensitive resources

</div>

**2. IP Addresses :**

<div dir="rtl">

كل subdomain بيبق مربوط بالـ IP addresses وده بيديلك targets جاهزة تكمل عليها Recon أو حتي تبدأ Attacks 

</div>

**3. Name Server Records :**

<div dir="rtl">

معلومات عن authoritative name servers الخاصة بالدومين وده ممكن يكشف الـ hosting provider & potential misconfigurations 

</div>

---

## Remediation

<div dir="rtl">

لحسن الحظ بقي في وعي أكبر بالثغرة دي ومعظم الـ DNS server administrators بقو واخدين بالهم منها وعالجو المشكلة دلوقتي وأغلب الـ DNS server بتتظبط إنها تسمح بالـ zone transfer بس للـ trusted secondary servers وده بيضمن إن الـ sensitive zone data تفضل protected ومحدش يوصلها بسهولة 

لكن بردو ممكن يحصل أي misconfigurations بسبب خطأ بشري أو إستخدام إعدادات قديمة علشان كده إنك تجرب عمل zone transfer لسه تعتبر تكنيك مفيدة جداً في الـ reconnaissance حتي لو العملية فشلت مجرد المحاولة ممكن يديك information عن إعدادات الـ DNS server والـ  security posture بتاعه 

</div>

---

## Exploiting Zone Transfers 

<div dir="rtl">

تقدر تستخدم أمر `dig` علشان تطلب zone transfer من السيرفر 

</div>


```bash 
AbuElOyun1@kali[~]$ dig axfr @nsztm1.digi.ninja zonetransfer.me
```

<div dir="rtl">

الأمر ده بيقول لـ dig إنه يعمل request a full zone transfer (`axfr`)
من DNS server المسؤول عن دومين `zonetransfer.me`
لو السيرفر فيه misconfigured وبيسمح بعملية النقل دي هيرجع لك كل الـ DNS records الخاصة بالدومين 

</div>


```bash
AbuElOyun1@kali[~]$ dig axfr @nsztm1.digi.ninja zonetransfer.me

; <<>> DiG 9.18.12-1~bpo11+1-Debian <<>> axfr @nsztm1.digi.ninja zonetransfer.me
; (1 server found)
;; global options: +cmd
zonetransfer.me.    7200    IN  SOA nsztm1.digi.ninja. robin.digi.ninja. 2019100801 172800 900 1209600 3600
zonetransfer.me.    300 IN  HINFO   "Casio fx-700G" "Windows XP"
zonetransfer.me.    301 IN  TXT "google-site-verification=tyP28J7JAUHA9fw2sHXMgcCC0I6XBmmoVi04VlMewxA"
zonetransfer.me.    7200    IN  MX  0 ASPMX.L.GOOGLE.COM.
...
zonetransfer.me.    7200    IN  A   5.196.105.14
zonetransfer.me.    7200    IN  NS  nsztm1.digi.ninja.
zonetransfer.me.    7200    IN  NS  nsztm2.digi.ninja.
_acme-challenge.zonetransfer.me. 301 IN TXT "6Oa05hbUJ9xSsvYy7pApQvwCUSSGgxvrbdizjePEsZI"
_sip._tcp.zonetransfer.me. 14000 IN SRV 0 0 5060 www.zonetransfer.me.
14.105.196.5.IN-ADDR.ARPA.zonetransfer.me. 7200 IN PTR www.zonetransfer.me.
asfdbauthdns.zonetransfer.me. 7900 IN   AFSDB   1 asfdbbox.zonetransfer.me.
asfdbbox.zonetransfer.me. 7200  IN  A   127.0.0.1
asfdbvolume.zonetransfer.me. 7800 IN    AFSDB   1 asfdbbox.zonetransfer.me.
canberra-office.zonetransfer.me. 7200 IN A  202.14.81.230
...
;; Query time: 10 msec
;; SERVER: 81.4.108.41#53(nsztm1.digi.ninja) (TCP)
;; WHEN: Mon May 27 18:31:35 BST 2024
;; XFR size: 50 records (messages 1, bytes 2085)
```

> `zonetransfer.me` is a service specifically setup from hack the box to demonstrate the risks of zone transfers so that the `dig` command will return the full zone record.

---

# Virtual Hosts

<div dir="rtl">

بعد ما الـ DNS يوجه الترافيك للسيرفر الصح بييجي الدور علي إعدادات الـ web server وهي اللي بتحدد الـ requests اللي داخل ده هيتعامل معاه إزاي
الـ web server زي `Apache`, `Nginx`, `IIS` بيبقو متصممين علي إ،هم يششغلو أكثر من موقع أو applications علي نفس السيرفر ونفس الـ ip وده بيتم عن طريق حاجة إسمها virtual hosting بتخلي السيرفر يقدر يفرق بين :
- domains 
- subdomains 
- even separate websites with distinct content

</div>

---

## How Virtual Hosts Work 

<div dir="rtl">

الفكرة الأساسية في الـ virtual hosting إن الـ web server يقدر يميز بين كذا موقع أو application شغالين علي نفس الـ IP address وده بيحصل بإستخدام حاجة اسمها `HTTP Host Header` 
وده بيبق جزء موجود في كل HTTP Request المتصفح بيبعته

</div>

## Understanding VHosts and Subdomains 

<div dir="rtl">

الفرق الأساسي بين الـ subdomains & VHosts بيرجع لعلاقتهم بالـ DNS وكمان بإعدادات الـ web server 


- *subdomains :*

<img src="/images/posts/img_1NF0-G4TH3R/Subdomain/subdomain.webp" alt="subdomain">


دي بتبق عبارة عن extensions للـ main domain مثال : (`blog.example.com` هو subdomian من `example.com`)
وبيبق ليها الـ DNS record الخاصة بيها وممكن تشير لنفس الـ IP بتاع الـ main domain أو IP مختلف

> الـ subdomains بتستخدم لتنظيم أقسام أو خدمات مختلفة داخل الموقع 



- *virtual hosts :*


دي عبارة عن configurations جوة الـ web server بتسمح إنك تستضيف كذا موقع أو application علي نفس السيرفر 

الـ VHost مش شرط يبق مربوط بنوع واحد من الدومينات 
لا هو ممكن يشتغل مع main domain زي example.com عادي
ويشتغل مع subdomains زي dev.example.com وبرضه تعمل VHost منفصل عادي
 
لو الـ virtula host ملوش DNS record تقدر برضه توصل له عن طريق إنك تعدل ملف Hosts علي جهازك وهنا ملف الـ Hosts بيسمحلك إنك تعمل mapping يدوي بين اسم الدومين وعنوان الـ IP وده بيخليك تتجاوز خطوة الـ DNS 

> لو مش فاهم الجزئية اللي فاتت دي فخليني اقولها ليك بالبلدي كده وهي إن الـ VHost بيبق موجود علي السيرفر فعلاً بس مفيش DNS Record أصلا يعني لو كتبت dev.example.com مش هيجيب حاجة لأن مفيش IP ولا حاجة أتواصل معاها
فهنا بنستخدم ملف الـ Hosts علشان نضيفه إحنا يدوي ونقدر نوصل له لأن غالباً المواقع بيكون فيها subdomains مش public ومش بتظهر في الـ DNS Record, النوع ده من الـ subdomains بيكون متاح فقط internally أو من خلال specific configurations 

الـ VHost Fuzzing هي technique بتستخدم لإكتشاف الـ subdomains سواء public & non-public وكمان الـ VHost عن طريق إنك بتعمل testing verious hostnames against a known IP address

</div>

---

## Server VHost Lookup

<div dir="rtl">

الصورة الجاية بتوضح إزاي الـ web server بيحدد المحتوي الصحيح اللي هيجيبه ليك بناء علي الـ Host Header 

</div>

<img src="/images/posts/img_1NF0-G4TH3R/Subdomain/virtualhosts.png" alt="virtualhosts">

### 1. Browser Requests a Website :

<div dir="rtl">

لما بتدخل domain name زي `www.inlanefreight.com`  في المتصفح, المتصفح بيبدأ يبعت HTTP request للـ web server المرتبط بالـ IP بتاع الدومين ده 

</div>

### 2. Host Header Reveals the Domain :

<div dir="rtl">

المتصفح في الطلب اللي بيتبعت بيضيف الـ domain name داخل Host Header وده بيكون كده زي علامة بتوضح للسيرفر أنهي موقع انت عايزه

</div>

### 3. Web Server Determines the Virtual Host :

<div dir="rtl">

الـ web server بيستقبل الطلب اللي إتبعت ده ويفحص الـ Host Header وبعدين يرجع يشوف الـ configuration بتاع الـ virtual host علشان يلاقي الـ entry المطابق لإسم الدومين المطلوب

</div>

### 4. Serving the Right Content :

<div dir="rtl">

بعد تحديد الـ virtual host الصح السيرفر بيجيب الـ files & resources بتاعت الموقع ده من الـ document root وبيبعتها للمتصفح كـ HTTP response

</div>

---

## Virtual Host Discovery Tools 

<div dir="rtl">

مع إن التحليل اليدوي للـ HTTP Headers و Reverse DNS Lookups ممكن يكون مفيد بس فيه أدوات متخصصة لإكتشاف الـ VHost بتعمل automate للعملية دي وبتبق أسرع وأشمل والأدوات دي بتستخدم تقنيات مختلفة علشان تعمل probe علي السيرفر المطلوب وتقدر تكتشف الـ VHost المحتملة 

</div>

### Several tools are available to aid in the discovery of virtual hosts :

| Tool        | Description                                                                 | Features                                                      |
|-------------|-----------------------------------------------------------------------------|--------------------------------------------------------------|
| gobuster    | A multi-purpose tool often used for directory/file brute-forcing, but also effective for virtual host discovery. | Fast, supports multiple HTTP methods, can use custom wordlists |
| Feroxbuster | Similar to Gobuster, but with a Rust-based implementation, known for its speed and flexibility. | Supports recursion, wildcard discovery, and various filters   |
| ffuf        | Another fast web fuzzer that can be used for virtual host discovery by fuzzing the Host header. | Customizable wordlist input and filtering options             |

 ---

## gobuster

<div dir="rtl">

أداة Gobuster تعتبر أداة versatile كده وبتستخدم في إنك تعمل brute-forcing للـ directory والملفات لا وكمان قوية جداً في virtual hosts discovery وبتشتغل عن طريق إنها بتعمل HTTP requests بشكل متكرر لنفس الـ IP بس في كل طلب وكل مرة بتغير الـ Host Header وبعد كده بتسجل الـ response علشان تحدد أنهي valid virtual hosts 

</div>

### There are a couple of things you need to prepare to brete force Host headers 

<div dir="rtl">

- 1. Target Identification :  


لازم الأول تحدد الـ IP الخاص بالـ target web server's وده بتعمله عن طريق DNS lookup أو أي reconnaissance techniques


- 2. Wordlist Preparation :


تجهز wordlist فيها host names محتملة للـ virtual hosts وممكن تستخدم wordlist جاهزة زي Seclists أو تعمل واحدة custom بناء علي target's industry, naming conventions, or other relevant information

</div>

### The `gobuster` command to bruteforcevhosts generally looks like this :

```bash
AbuEIOyun1@htb[/htb]$ gobuster vhost -u http://inlanefreight.htb:81 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:             http://inlanefreight.htb:81
[+] Method:          GET
[+] Threads:         10
[+] Wordlist:        /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:      gobuster/3.6
[+] Timeout:         10s
[+] Append Domain:   true
===============================================================
Starting gobuster in VHOST enumeration mode
===============================================================
Found: forum.inlanefreight.htb:81 Status: 200 [Size: 100]
[...]
Progress: 114441 / 114442 (100.00%)
===============================================================
Finished
===============================================================
```

- The `-u` flag specifies the target URL.

- The `-w` flag specifies the wordlist file (replace `<wordlist_file>` with the path to your wordlist).

- The `--append-domain` flag appends the base domain to each word in the wordlist.


**There are a couple of other arguments that are worth knowing :**


- Consider using the `-t` flag to increase the number of threads for faster /scanning.

- The `-k` flag can ignore SSL/TLS certificate errors.

- You can use the `-o` flag to save the output to a file for later analysis.


> Virtual host discovery can generate significant traffic and might be detected by intrusion detection systems (IDS) or web application firewalls (WAF). Exercise caution and obtain proper authorization before scanning any targets.

---

# Certificate Transparency Logs 

<div dir="rtl">

في الزحمة الرهيبة بتاعت الإنترنت موضوع الـ trust مش حاجة مضمونة بسهولة وواحدة من أهم الحاجات اللي بتبني الـ trust دي هي `Secure Sockets Layer/Transport Layer Security` (`SSL/TLS`) واللي شغلته إنها تعمل تشغير للإتصال بين المتصفح بتاعك والموقع 

جوة الـ SSL/TLS في حاجة اسمها `digital certificate` ودي عبارة عن فايل صغير وظيفته يثبت هوية الموقع ويخلي الإتصال بينك وبينه secure, encrypted communication.

بس المشكلة إن عملية إصدار وإدارة الشهارات دي isn't foolproof وممكن يحصل إن crtificate تطلع بالغلط أو بشكل مش موثوق وساعتها الـ attacker يقدر يستغل ده علشان يمعل نفسه موقع حقيقي ويسرق sensitive data أو حتي ينشر malware وهنا بييجي دور حاجة اسمها Certificate Transparency (CT) logs 
</div>

---

## What are Certificate Transparency Logs?

<div dir="rtl">

ببساطة الـ (CT) logs عبارة عن سجلات public وبتكون  append-only (يعني بتضيف بيانات بس ومفيش حذف أو تعديل علي القديم) السجلات دي بتسجل كل شهادات SSL/TLS اللي بيتم إصدارها 

وأول ما الـ Certificate Authority (CA) بتطلع شهادة جديدة لازم تبعتها لأكثر من CT logs والسجلات دي بيتم إدارتها من منظمات مستقلة وأي حد يقدر يراجعها ويشوف محتواها 
</div>

---

## This transparency serves several crucial purposes : 

<div dir="rtl">

- Early Detection of Rogue Certificates : 


لو حد طلع certificate مزورة أو بالغلط الـ security researchers and website owners يقدرو يلاحطو ده بسرعة من خلال الـ CT logs والـ rogue certificate دي ببساطة شهادة مزيفة أو غير مصرح بيها طالعة من certificate authouity موثوق وإكتشافها بدري بيساعد إنهم يلغوها قبل ما تستغل في هجمات 


- Accountability for Certificate Authorities :


بما إن كل حاجة public أي CAs تطلع شهادة بشكل مخالف للقوانين أو الـ standards هتبقي مكشوفة وده ممكن يسبب فقدان الثقة فيها أو فرض عليها  عقوبات 


- Strengthening the Web PKI (Public Key Infrastructure) :


الـ Web PKI هو النظام اللي بيعتمد عليه الإنترنت في التأمين والثقة ووجود CT logs بيزود الأمان والنزاهة بتاعته لأنه بيدي وسيلة إن اي حد يراجع ويتأكد من الشهادات 

</div>

---

## CT Logs and Web Recon

<div dir="rtl">

الـ Certificate Transparency logs بتديك ميزة قوية جداً في موضوع إكتشاف الـ subdomain enumeration علي عكس طرق الـ brute-forcing أو إستخدام wordlist بتعتمد إنك تخمن subdomain names أو تجرب إحتمالات

الـ CT logs بتديك سجل حقيقي ومؤكد لكل الـ certificates اللي إتصدرت لدومين معين أو لأي subdomain تابع له يعني بدل ما تفضل تجرب وتخمن أنت قدرامك بيانات فعلية مبنية علي شهادات إتعملت فعلاً 

الميزة هنا إنك مش محدود بحجم الـ wordlist أو قوة الخوارزمية بتاعت الـ brute-forcing لكن عندك رؤية شاملة لكل الـ subdomains اللي كان ليها شهادات حتي لو مش شغالة دلوقتي أو مش سهلة التخمين 

كمان الـ CT logs ممكن تكتشف ليك subdomains قديمة أو شهادتها بقت expired النوع ده من الـ subdomain ساعات بيكون عليه أنظمة أو إعدادات قديمة وده ممكن يخليها عرضة لثغرات أو إستغلال 

</div>

---

## Searching CT Logs

**There are two popular options for searching CT logs:**

| Tool    | Key Features                                                                 | Use Cases                                                                 | Pros                                           | Cons                                      |
|---------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|------------------------------------------------|-------------------------------------------|
| crt.sh  | User-friendly web interface, simple search by domain, displays certificate details, SAN entries. | Quick and easy searches, identifying subdomains, checking certificate issuance history. | Free, easy to use, no registration required.   | Limited filtering and analysis options.   |
| Censys  | Powerful search engine for internet-connected devices, advanced filtering by domain, IP, certificate attributes. | In-depth analysis of certificates, identifying misconfigurations, finding related certificates and hosts. | Extensive data and filtering options, API access. | Requires registration (free tier available). |



### crt.sh lookup

<div dir="rtl">

رغم إن موقع crt.sh فيه واجهة سهلة للبحث لكن تقدر تستخدمه كـ API من التيرمنال علشان تعمل للعملية دي automation وتفلتر النتائج علي حسب اللي إنت عايزه 

</div>

**Let's see how to find all 'dev' subdomains on `facebook.com` using `curl` and `jq`:**

```bash
AbuElOyun@kali[~]$ curl -s "https://crt.sh/?q=facebook.com&output=json" | jq -r '.[]
 | select(.name_value | contains("dev")) | .name_value' | sort -u
 
*.dev.facebook.com
*.newdev.facebook.com
*.secure.dev.facebook.com
dev.facebook.com
devvm1958.ftw3.facebook.com
facebook-amex-dev.facebook.com
facebook-amex-sign-enc-dev.facebook.com
newdev.facebook.com
secure.dev.facebook.com
```

- `curl -s "https://crt.sh/?q=facebook.com&output=json"`: This command fetches the JSON output from crt.sh for certificates matching the domain `facebook.com`.

- `jq -r '.[] | select(.name_value | contains("dev")) | .name_value'`: This part filters the JSON results, selecting only entries where the `name_value` field (which contains the domain or subdomain) includes the string "`dev`". The `-r` flag tells `jq` to output raw strings.

- `sort -u`: This sorts the results alphabetically and removes duplicates.
