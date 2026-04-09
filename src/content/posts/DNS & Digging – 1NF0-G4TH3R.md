---
title: DNS & Digging – 1NF0-G4TH3R
published: 2026-04-09
description: ‫‫فهم DNS & dig واستخدامه في جمع Web Recon.‬
image: /images/posts/img_1NF0-G4TH3R/img_DNS&dig/DNS.wdmp
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



تخيل دلوقتي إنك عايز تخش علي موقع www.example.com فبسهولة بتروح فاتح المتصفح وتكتب إسم الموقع , لكن الكمبيوتر مش بيفهم الكلمات أو لغة البشر هو بيتعامل بس مع لغة الأرقام وتحديداً عناوين IP,  
كلام جميل , المفروض دلوقتي يبق عندك سؤال وهو إزاي بيحول من لغة البشر إلي عناوين IP مناسبة للكمبيوتر.

هنا بق بييجي دور الـ DNS:  
> `The internet's trusty translator`

*تعالا بق ناخد رحلة صغيرة ونشوف العملية دي بتتم إزاي.*

<div align="center">

<img src="/images/posts/img_1NF0-G4TH3R/img_DNS&dig/Works.webp" alt="How To Works DNS" align="center" width="600"/>

</div>




### 1. your computer asks for direction (DNS Query)



لما أنت بتدخل الـ Domain Name بتاع الموقع جهازك بيروح أول حاجة يدور عنده في الـ cach علشان يشوف هل هو محتفظ بعنوان الـ IP بتاع الموقع من زيارة سابقة ولا لا ولو ملقهوش بيرح علي طول بيتواصل مع DNS Resolver واللي هو غالباً بيبق تابع لمزود خدمة الإنترنت بتاعك ( ISP )



### 2. the DNS resolver checks its map (recursive lookup)



الـ resolver هو كمان عنده cache بيروح يدور فيها ولو لقاها بيرجعها للجهاز بتاعك ولو ملقهاش بيبدأ بعدها يروح لـ rook name server 




### 3. Root Name Server Points the way



الـ root server هو ميرفش الـ IP بتاع الـ Domain Name ده أي بالظبط ولكن هو عارف مين يعرف  

*طيب هو بيعمل أي بالظبط :*

الـ root بيرد عليك بحاجة اسمها referral يقولك أنا مش عارف الـ ip ده بس الـ TLD بتاع الـ Domain هو .com يبقي روح إسأل سيرفرات .com  

> فهو بس بيوجه الـ resolver في المكان الصح 



### 4. TLD Name server narrows it down



الـ TLD name server هو بيشبه الخريطة الإقليمية  
وهو اللي عارف الـ Authoritative name server المسؤول عن الـ specific domain وبعدها بيوجه الـ resolver لهناك.


### 5. Authoritative name server delivers the address


دي بتبق اخر محطة وهو اللي عنده الإجابة النهائية فبيجيب الـ IP وبيبعته للـ Resolver 


### 6. the DNS resolver returns the information


بيستلم الـ resolver عنوان الـ IP ويعيده إلي جهازك وبيحتفظ بيه في الـ caching عنده علشان لو إحتجته تاني قريباً 


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




<div align="center">

<img src="/images/posts/img_1NF0-G4TH3R/img_DNS&dig/Hosts.wdmp" alt="Hosts File" align="center" width="300" height="300"/>

</div>




ملف الـ hosts هو simple text file بيستخدم لربط الـ host names بعناوين IP , بيوفر طريقة يدوية لعملية الـ Domain name resolution بدل ما تعتمد علي نظام الـ DNS  

بينما يقوم DNS بترجمة الـ Domain name إلي عناوين IP بشكل تلقائي يسمح لك ملف الـ Hosts بإنك تعمل تعديلات محلية مباشرة  

*وده بيبق مفيد جداً في:*

- Development  
- Troubleshooting  
- Blocking websites  


### - ملف الـ Hosts في ويندوز:

```bash
c:\windows\system32\drivers\etc\hosts
```
### - في Linux & macOS:
```bash
/etc/hosts
```
> علشان تعدل علي الملف ده لازم تفتحه بصلاحيات administrator أو root

---



## Key DNS concepts
### DNS Zone




تعتبر الـ zone جزء محدد من domain name space بيتم إدارته بواسطة جهة أو مسؤول معين, وتعتبر حاوية إفتراضية لمجموعة من الـ domain names والـ records الخاصة بهم

*علي سبيل المثال :*

لو عندنا الدومين الرئيسي : `example.com`

وكذلك كل الـ subdomains الخاصة بهم : `blog.example.com` - `mail.example.com`
> كلهم بينتمو لنفس الـ DNS Zone لو كانو تحت نفس الإدارة يعني نفس الشخص أو الجهة المسؤولة عن إدارة DNS Records الخاصة بهم

### كل Zone بيكون ليها Zone File
وده عبارة عن text file موجود علي DNS server, بيحدد فيه كل الـ `resource records` اللي جوة الـ zone (هنتكلم عنهم بعد شوية), وبيوفر معلومات مهمة علشان نقدر نترجم أسماء الدومينات لـ IP Addresses

مثال مبسط لملف Zone لدومين  `example.com`



```bash 
$TTL 3600 ; Default Time-To-Live (1 hour)
@       IN SOA   ns1.example.com. admin.example.com. (
                2024060401 ; Serial number (YYYYMMDDNN)
                3600       ; Refresh interval
                900        ; Retry interval
                604800     ; Expire time
                86400 )    ; Minimum TTL

@       IN NS    ns1.example.com.
@       IN NS    ns2.example.com.
@       IN MX 10 mail.example.com.
www     IN A     192.0.2.1
mail    IN A     198.51.100.1
ftp     IN CNAME www.example.com.
```




الملف ده بيحدد : 
- authoritative name servers (NS records)
- mail server (MX record)
- IP addresses (A records)

الـ DNS Server بتخزن أنواع مختلفة من `resource records` وكل نوع له وظيفة محددة في عملية ترجمة أسماء الدومينات لـ IP addresses

*بعد ما فهمنا أساسيات الـ DNS نقدر نغوص أكثر في بناء المعلومات جوة الـ DNS واللي بيتمثل في Record types المختلفة كل نوع record بيخزن بيانات معينة للدومين وبيخدم غرض محدد*

---

##  أشهر أنواع الـ DNS records



| Record Type | Full Name                | Description                                                                 | Zone File Example                                                                 |
|------------|--------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| A          | Address Record           | Maps a hostname to its IPv4 address.                                        | `www.example.com. IN A 192.0.2.1`                                                 |
| AAAA       | IPv6 Address Record      | Maps a hostname to its IPv6 address.                                        | `www.example.com. IN AAAA 2001:db8:85a3::8a2e:370:7334`                           |
| CNAME      | Canonical Name Record    | Creates an alias for a hostname, pointing it to another hostname.           | `blog.example.com. IN CNAME webserver.example.net.`                               |
| MX         | Mail Exchange Record     | Specifies the mail server(s) responsible for handling email for the domain. | `example.com. IN MX 10 mail.example.com.`                                         |
| NS         | Name Server Record       | Delegates a DNS zone to a specific authoritative name server.               | `example.com. IN NS ns1.example.com.`                                             |
| TXT        | Text Record              | Stores arbitrary text information, often used for domain verification.      | `example.com. IN TXT "v=spf1 mx -all"`                                            |
| SOA        | Start of Authority Record| Specifies administrative information about a DNS zone.                      | `example.com. IN SOA ns1.example.com. admin.example.com. 2024060301 10800 ...`     
| SRV        | Service Record           | Defines the hostname and port number for specific services.                 | `_sip._udp.example.com. IN SRV 10 5 5060 sipserver.example.com.`                  |
| PTR        | Pointer Record           | Used for reverse DNS lookups.                                               | `1.2.0.192.in-addr.arpa. IN PTR www.example.com.`                                 |




###  معني الـ "IN"
‫IN في الأمثلة معناها Internet. ده ببساطة `class` في Records DNS بيحدد نوع البروتوكول المستخدم.
أغلب الوقت هتشوفه `IN` لأنه يدل على بروتوكولات الإنترنت القياسية (IPv4/IPv6).

‬فيه قيم تانية زي:
CH → Chaosnet
HS → Hesiod

لكن الحاجات دي نادرة جدًا في الاستخدام الحديث.
> الـ IN هو `default` في أغلب الحالات ومش هتشوف غيره تقريبًا في الشغل الحقيقي.

---




##  Let's explore some of the most common DNS concepts:

| DNS Concept              | Description                                                                 | Example                                                                 |
|--------------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| Domain Name              | A human-readable label for a website or other internet resource.           | `www.example.com`                                                        |
| IP Address               | A unique numerical identifier assigned to each device connected to the internet. | `192.0.2.1`                                                        |
| DNS Resolver             | A server that translates domain names into IP addresses.                   | Your ISP's DNS server or public resolvers like Google DNS (`8.8.8.8`)    |
| Root Name Server         | The top-level servers in the DNS hierarchy.                                | There are 13 root servers worldwide, named A-M: `a.root-servers.net`     |
| TLD Name Server          | Servers responsible for specific top-level domains (e.g., .com, .org).     | Verisign for `.com`, PIR for `.org`                                      |
| Authoritative Name Server| The server that holds the actual IP address for a domain.                  | Often managed by hosting providers or domain registrars                  |
| DNS Record Types         | Different types of information stored in DNS.                              | `A`, `AAAA`, `CNAME`, `MX`, `NS`, `TXT`, etc.                            |

---

##  ليه الـ DNS مهم في الـ Web Recon
الـ DNS مش مجرد نظام بيحوّل الدومين لـ IP، ده جزء مهم جدًا من البنية التحتية لأي target، وتقدر تستغله في الريكون عشان تكتشف ثغرات أو نقاط دخول.

1. (Uncovering Assets)

من خلال الـ DNS records تقدر تطلع معلومات كتير جدًا زي:
- subdomains
- mail servers
- name servers
*مثال:*
لو لقيت حاجة زي:

```bash 
dev.example.com CNAME oldserver.example.net
```
> ده ممكن يدل إن فيه سيرفر قديم لسه مربوط، وغالبًا بيكون فيه ثغرات → نقطة دخول سهلة.

2. (Mapping Infrastructure)

3. (Monitoring Changes)

---

# Digging DNS

بعد ما بقينا فاهمين أساسيات الـ DNS وأنواع الـ Records المختلفة نقدر دلوقتي نبدأ ندخل في الجزء العملي 
السيكشن ده هيركز علي الأدوات والتقنيات اللي تقدر تستخدمهم علشان تستغل الـ DNS في الـ web reconnaissance 


## DNS Tools :


في الـ DNS Reconnaissance بنستخدم أدوات مخصوصة علشان نعمل queries علي DNS Server ونطلع معلومات مفيدة عن التارجت 



### The most popular and versatile tools :

| Tool                     | Key Features                                                                 | Use Cases                                                                 |
|---------------------------|------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| dig                      | Versatile DNS lookup tool that supports various query types (A, MX, NS, TXT, etc.) and detailed output. | Manual DNS queries, zone transfers (if allowed), troubleshooting DNS issues, and in-depth analysis of DNS records. |
| nslookup                 | Simpler DNS lookup tool, primarily for A, AAAA, and MX records.             | Basic DNS queries, quick checks of domain resolution and mail server records. |
| host                     | Streamlined DNS lookup tool with concise output.                            | Quick checks of A, AAAA, and MX records.                                  |
| dnsenum                  | Automated DNS enumeration tool, dictionary attacks, brute-forcing, zone transfers (if allowed). | Discovering subdomains and gathering DNS information efficiently.         |
| fierce                   | DNS reconnaissance and subdomain enumeration tool with recursive search and wildcard detection. | User-friendly interface for DNS reconnaissance, identifying subdomains and potential targets. |
| dnsrecon                 | Combines multiple DNS reconnaissance techniques and supports various output formats. | Comprehensive DNS enumeration, identifying subdomains, and gathering DNS records for further analysis. |
| theHarvester             | OSINT tool that gathers information from various sources, including DNS records (email addresses). | Collecting email addresses, employee information, and other data associated with a domain from multiple sources. |
| Online DNS Lookup Services | User-friendly interfaces for performing DNS lookups.                        | Quick and easy DNS lookups, convenient when command-line tools are not available, checking for domain availability or basic information. |

---

## The Domai Information Groper (dig)

أداة (dig) بإختصار هي تعتبر من أهم وأقوي الأدوات في الـ DNS بتستخدمها علشان تعمل querying علي DNS Server وتجيب أنواع مختلفة من DNS Records

اللي بيمزها عن باقي الأدوات إنها :
- مرنة جداً في الإستخدام 
- بتطلع تفاصيل كتير
- تقدر تتحكم في شكل الـ output

> وده بيخليها (go-to-choice) لأي حد

---


### Common dig commands :

| Command                    | Description                                                                                                      |
|-----------------------------|------------------------------------------------------------------------------------------------------------------|
| dig domain.com             | Performs a default A record lookup for the domain.                                                               |
| dig domain.com A           | Retrieves the IPv4 address (A record) associated with the domain.                                               |
| dig domain.com AAAA        | Retrieves the IPv6 address (AAAA record) associated with the domain.                                            |
| dig domain.com MX          | Finds the mail servers (MX records) responsible for the domain.                                                 |
| dig domain.com NS          | Identifies the authoritative name servers for the domain.                                                       |
| dig domain.com TXT         | Retrieves any TXT records associated with the domain.                                                           |
| dig domain.com CNAME       | Retrieves the canonical name (CNAME) record for the domain.                                                     |
| dig domain.com SOA         | Retrieves the start of authority (SOA) record for the domain.                                                   |
| dig @1.1.1.1 domain.com   | Specifies a specific name server to query; in this case 1.1.1.1                                                  |
| dig +trace domain.com      | Shows the full path of DNS resolution.                                                                          |
| dig -x 192.168.1.1         | Performs a reverse lookup on the IP address 192.168.1.1 to find the associated host name. You may need to specify a name server. |
| dig +short domain.com      | Provides a short, concise answer to the query.                                                                  |
| dig +noall +answer domain.com | Displays only the answer section of the query output.                                                          |
| dig domain.com ANY         | Retrieves all available DNS records for the domain (Note: Many DNS servers ignore ANY queries to reduce load and prevent abuse, as per RFC 8482). |






`Caution` 
> بعض السيرفرات ممكن تلاحظ إنك بتبعت عدد كبير من DNS Queries وساعتها ممكن تعملك Block 
علشان كده : 
- استخدم الأدوات بحذر 
- إحترم الـ rate limits 
- متزودش في عدد الـ Queries بشكل مبالغ فيه 
وأهم حاجة : 
> لازم يكون عندك permission قبل ما تعمل DNS Recon بشكل كبير علي أي Target

---



## Groping DNS

```bash
AbuEIOyun1@kali[~]$ dig google.com

; <<>> DiG 9.18.24-0ubuntu0.22.04.1-Ubuntu <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 16449
;; flags: qr rd ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
;; WARNING: recursion requested but not available

;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             0       IN      A       142.251.47.142

;; Query time: 0 msec
;; SERVER: 172.23.176.1#53(172.23.176.1) (UDP)
;; WHEN: Thu Jun 13 10:45:58 SAST 2024
;; MSG SIZE  rcvd: 54
```



لما بتكتب: `dig google.com` انت كده بتقول: يا DNS، هاتلي الـ `A) record)`بتاع الدومين ده
بس اللي بيرجعلك مش مجرد IP… ده بيبق `full report` عن اللي حصل


## الـ dig output متقسم دايمًا لـ 4 أجزاء:



### 1. Header Section
```bash
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 16449
```


`الـ opcode:` يعني نوع العملية → QUERY عادي
`الـ status:` 
- NOERROR → كله تمام
- NXDOMAIN → الدومين مش موجود 
- SERVFAIL → السيرفر فشل

```bash
;; flags: qr rd ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0
```
الـ flags دي عبارة عن شوية “علامات” أو bits صغيرة في الـ DNS response،
كل واحدة فيهم بتقولك معلومة عن اللي حصل في الـ query.

*تعالي نفهم كل flag واحدة واحدة*



1. qr → Query Response



دي معناها إن ده response مش request



2. rd → Recursion Desired


دي معناها إنك طلبت من السيرفر يعمل recursion
*طب يعني ايه recursion؟* يعني:
بدل ما السيرفر يقولك "مش عارف"
هو يروح يسأل باقي السيرفرات (root → TLD → authoritative) لحد ما يجيبلك الإجابة, يعني ميرجعش وإيده فاضية



3. ad → Authentic Data



دي معناها إن البيانات verified باستخدام DNSSEC 
يعني السيرفر بيقولك "أنا متأكد إن الداتا دي أصلية"



### 2. Question Section
```bash 
;google.com. IN A
```


السطر ده بيوضح السؤال اللي انت سألته: ‫ايه الـ IPv4 address (A record) الخاص بـ google.com؟‬




### 3. Answer Section
```bash
google.com. 0 IN A 142.251.47.142
```


ده الرد على سؤالك بيقولك إن الـ IP الخاص بـ google.com هو: `142.251.47.142`

تفصيل السطر:
الدومين → google.com
0 → الـ TTL (Time To Live)
الـ IN → Internet
الـ A → نوع الـ Record
142.251.47.142 → الـ IP

> الـ 0 هنا معناها إن النتيجة مش هتتخزن في الـ (cache) أو هتخلص فورًا




### 4. Footer



الـ Footer بيبقى فيه شوية معلومات إضافية عن الطلب زي الوقت اللي أخده التنفيذ (Query time) والسيرفر اللي رد عليك.
وكمان بيعرض تفاصيل تانية زي توقيت تنفيذ الطلب (WHEN) وحجم الرسالة اللي استلمتها (MSG SIZE).

---




🧠 Challenge




لو وصلت لحد هنا… يبقى انت بدأت تفهم الدنيا ماشية إزاي 👀

لما شغّلنا الأمر: `dig google.com`
ظهر عندنا في الـ Header Section السطر ده:`;; WARNING: recursion requested but not available`

*المطلوب هنا*
1. ليه التحذير ده ظهر أصلاً؟
2. إيه اللي مفروض يظهر في الـ flags لو السيرفر بيقبل يعمل recursion بشكل طبيعي؟


</div>
