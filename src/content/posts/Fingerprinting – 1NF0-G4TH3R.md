---
title: HTB | 1NF0-G4TH3R – Fingerprinting
published: 2026-04-30
description: A hands-on guide to web fingerprinting, covering techniques like banner grabbing, HTTP header analysis, and tools such as Wafw00f and Nikto to uncover technologies and potential vulnerabilities.
image: /images/posts/img_1NF0-G4TH3R/img_Fingerprinting/fingerprinting.webp
tags: [wafw00f, nikto, Fingerprinting Techniques]
category: Information-Gathering Series
draft: false
pinned: false
comment: true
lang: ar
---

# Fingerprinting 

<div dir="rtl">

الـ fingerprinting بيكون هدفه الأساسي هو إستخراج تفاصيل تقنية عن الـ technlolgies اللي شغالة ورا website or web application وكمان الـ digital signatures الخاصة بالـ web servers والـ operating systems والـ software components بتكشف ليك معلومات مهمة جداً عن الـ infrastructure بتاع الهدف وكمان ممكن توضع potential security weaknesses 

المعلومات دي بتساعد الـ attacker إنهم يظبطو الهجمات بتاعتهم ويستهدفو vulnerabilities معينة حسب التكنولوجي المستخدمة 

</div>

**Fingerprinting serves as a cornerstone of web reconnaissance for several reasons :**

- `Targeted Attacks` :
 
<div dir="rtl">

لما تبقي عارف التكنولوجي المستخدمة بالظبط ساعتها تقدر تركز علي exploits and vulnerabilities معروفة إنها بتأثر علي الأنظمة دي وده بيزود فرصة نجاح الهجوم بشكل كبير 

</div>

- `Identifying Misconfigurations` :

<div dir="rtl">

الـ fingerprinting ممكن يكشف إعدادات غلط أو outdated software أو default settings أو مشاكل تانية مش واضحة بسهولة في طرق reconnaissance تانية

</div>

- `Prioritising Targets` :

<div dir="rtl">

لو عندك كذا target الـ fingerprinting بيساعدك تحدد تبدأ بأنهي واحد فيهم بناء علي إنه يكون أكثر عرضة للثغرات عن غيره أو فيه معلومات مهمة 

</div>

- `Buliding a Comprehensive Profile` :

<div dir="rtl">

لما تجمع بيانات الـ fingerprint مع باقي معلومات الـ reconnaissance بتبني عندك صورة كاملة للـ infrastructure بتاع التارجت وده بيساعدك إنك تفهم الـ security posture بتاعه وكمان الـ attack vectors الممكنة 

</div>

--- 

## Fingerprinting Techniques

<div dir="rtl">

**فيه كذا طريقة بتستخدم في الـ web server and technology fingerprinting :**

</div>

- `Banner Grabbing` :

<div dir="rtl">

الـ Banner grabbing بيعتمد علي تحليل الـ banner اللي بيعرضها الـ web server أو اي services تانية والـ banner ده غالباً بتكشف ليك نوع الـ server software, version numbers , and other details

</div>

- `Analysing HTTP Headers` :

<div dir="rtl">

الـ HTTP headers اللي بتتبعت مع كل request and response فيها معلومات كتير زي :

`server header` وده بيكشف نوع الـ web server

`X-Powered-By` وده ممكن يوضح تكنولوجيز إضافية زي الـ frameworks

</div>

- `Probing for Specific Responses` :

<div dir="rtl"> 

هنا بتبعت requests مخصوص إنت عملتها بشكل معين للـ target بحيث إنك تشوف ردود معينة ومميزة والردود دي ممكن تكشف عن نوع التكنولوجي أو حتي الـ version زي مثلاً بعض رسائل الـ error أو behavior معين بيكون مميز لنوع server أو software معين

</div>

- `Analysing Page Content` :

<div dir="rtl">

محتوي الصفحة نفسه ممكن يديك hints عن التكنولوجي المستخدمة سواء من خلال structure الصفحة أو الـ script and other elements وكمان ساعات هتلاقي `comments` بتوضح نوع الـ software المستخدم  

</div>


**for example, A variety of tools exist that automate the fingerprinting process, combining various techniques to identify web servers, operating systems, content management systems, and othe technologies :**

| **Tool**       | **Description**                                                                 | **Features**                                                                 |
|------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| `Wappalyzer` | Browser extension and online service for website technology profiling.      | Identifies a wide range of web technologies, including CMSs, frameworks, analytics tools, and more. |
| `BuiltWith`  | Web technology profiler that provides detailed reports on a website's technology stack. | Offers both free and paid plans with varying levels of detail.           |
| `WhatWeb`    | Command-line tool for website fingerprinting.                               | Uses a vast database of signatures to identify various web technologies. |
| `Nmap`       | Versatile network scanner used for reconnaissance and fingerprinting.       | Can be used with NSE scripts for specialized fingerprinting tasks.       |
| `Netcraft`   | Provides web security services including fingerprinting and reporting.      | Offers detailed reports on hosting, technologies, and security posture.  |
| `wafw00f`    | Command-line tool for identifying Web Application Firewalls (WAFs).         | Detects presence and type of WAF and its configuration.                  |


---

## Fingerprinting inlanefreight.com

<div dir="rtl">

تعالي بق نطبق كلام الـ fingerprinting دده عملي علي `inlanefreight.com` علشان نكشف digital DNA بتاعه

هنستخدم mix ما بين manual and automated techniques علشان نطلع معلومات عن الـ web server, technologies, and potential vulnerbilities.

</div>

### Banner Grabbing 

<div dir="rtl">

أول خطوة إننا نحاول نجيب معلومات مباشرة من الـ web server نفسه بنعمل كده بإستخدام أمر `curl` مع option `-I` أو (`-- head`) علشان نجيب الـ HTTP headers بس من غير ما نحمل الصفحة كلها

</div>

```bash
AbuElOyun1@kali[~]$ curl -I inlanefreight.com
```
<div dir="rtl">

الـ output بيكون فيه الـ server banner واللي بيكشف نوع الـ web server والـ version number :

</div>

```bash
AbuElOyun1@kali[~]$ curl -I inlanefreight.com

HTTP/1.1 301 Moved Permanently
Date: Fri, 31 May 2024 12:07:44 GMT
Server: Apache/2.4.41 (Ubuntu)
Location: https://inlanefreight.com/
Content-Type: text/html; charset=iso-8859-1
```

<div dir="rtl">

في الحالة دي بنشوف إن `inlanefreight.com` شغال علي `Apach/2.4.41` وتحديداً نسخة `Ubuntu` 

المعلومة دي أول فكرة عندنا وبتدينا فكرة عن الـ underlying technology stack 

كمان بيوضح إنه بيعمل redirect لـ `https://inlanefreight.com` فمهم نكمل ونجمع الـ banners هناك كمان 

</div>


```bash
AbuElOyun1@kali[~]$ curl -I https://inlanefreight.com

HTTP/1.1 301 Moved Permanently
Date: Fri, 31 May 2024 12:12:12 GMT
Server: Apache/2.4.41 (Ubuntu)
X-Redirect-By: WordPress
Location: https://www.inlanefreight.com/
Content-Type: text/html; charset=UTF-8
```

<div dir="rtl">

هنا ظهر header مهم جداً, السيرفر بيعمل redirect تاني بس المرة دي واضح إن `WordPress` هو المسؤول عن الـ redirection لـ `https://www.inlanefreight.com`

</div>

```bash
AbuElOyun1@kali[~]$ curl -I https://www.inlanefreight.com

HTTP/1.1 200 OK
Date: Fri, 31 May 2024 12:12:26 GMT
Server: Apache/2.4.41 (Ubuntu)
Link: <https://www.inlanefreight.com/index.php/wp-json/>; rel="https://api.w.org/"
Link: <https://www.inlanefreight.com/index.php/wp-json/wp/v2/pages/7>; rel="alternate"; type="application/json"
Link: <https://www.inlanefreight.com/>; rel=shortlink
Content-Type: text/html; charset=UTF-8
```

<div dir="rtl">

فيه شوية headers مهمين هنا أهمهم إن فيه path فيه `wp-json` 

الـ `wp-` prefix هو بيكون غالباً مرتبط بـ WordPress وده بيدينا تأكيد إضافي إن الموقع فعلاً شغال بإستخدامه 

</div>

### Wafw00f

<div dir="rtl">

الـ `Web Application Firewalls` (`WAFs`) هي طبقة حماية بتتحط قدام الـ web applications علشان تمنع أنواع كتير من الهجمات 

قبل ما تكمل في الـ fingerprinting مهم جداً تعرف هل `inlanefreight.com` وراه WAF ولا لا لأن ده ممكن يبوظ محاولات الإستكشاف بتاعتك أو يعمل block our requests 

</div>

**To detect the presence of a WAF, we'll use the `wafw00f` tool.**

```bash
AbuElOyun1@kali[~]$ wafw00f inlanefreight.com

                ______
               /      \
              (  W00f! )
               \  ____/
               ,,    __            404 Hack Not Found
           |`-.__   / /                      __     __
           /"  _/  /_/                       \ \   / /
          *===*    /                          \ \_/ /  405 Not Allowed
         /     )__//                           \   /
    /|  /     /---`                        403 Forbidden
    \\/`   \ |                                 / _ \
    `\    /_\\_              502 Bad Gateway  / / \ \  500 Internal Error
      `_____``-`                             /_/   \_\

                        ~ WAFW00F : v2.2.0 ~
        The Web Application Firewall Fingerprinting Toolkit
    
[*] Checking https://inlanefreight.com
[+] The site https://inlanefreight.com is behind Wordfence (Defiant) WAF.
[~] Number of requests: 2
```
<div dir="rtl">

الـ `wafw00f` scan علي `inlanefreight.com` بيبين إن الموقع محمي بـ `Wordfence Web Application Firewall ` (`WAF`) واللي معمول من شركة Defiant.

ده معناه إن فيه طبقة حماية إضافية شغالة فوق الموقع وممكن تمنع أو تعمل block لبعض محاولات الـ reconnaissance أو تعمل filtering للـ requests اللي بتتبعت للسيرفر

> لو في سيناريو حقيقي لازم تاخد بالك من النقطة دي وأنت بتعمل reconnaissance لأنك ممكن تحتاج تغير أسلوبك أو تعدل طريقة الـ request علشان تتفادي إن الـ WAF's يكتشفك أو يوقفك اثناء الـ fingerprinting

</div>

### Nikto

<div dir="rtl">

الأداة دي هي powerful open-source web server scanner.

هي مش بس أداة بنستخدمها علشان نعمل vulnerability assessment لا وكمان عندها جزء مهم في fingerprinting بيساعجك تفهم technology stack بتاع الموقع وتعرف هو شغال بإيه من ناحية السيرفر والتكنولوجي 

</div>

**To scan `inlanefreight.com` using `Nikto`, only running the fingerprinting modules, execute the following command :**

```bash
AbuEIOyun1@htb[/htb]$ nikto -h inlanefreight.com -Tuning b
```

<div dir="rtl">

الـ `-h` بنستخدمه علشان نحدد الـ target host

الـ `-Tuning b` بيخلي `Nikto` يشتغل بس علي modules الخاصة بـ software identification 

بعد كده `Nikto` بيبدأ يعمل series of testes علي الموقع وهدفها الأساسي إنه يحاول يحدد :

- هل فيه software قديم (outdated)
- هل فيه ملفات أو إعدادات مش امنة 
- اي مؤشرات ممكن تدل علي potentioa security risks 


</dvi>


```bash
AbuEIOyun1@htb[/htb]$ nikto -h inlanefreight.com -Tuning b

- Nikto v2.5.0
---------------------------------------------------------------------------
+ Multiple IPs found: 134.209.24.248, 2a03:b0c0:1:e0::32c:b001
+ Target IP:          134.209.24.248
+ Target Hostname:    www.inlanefreight.com
+ Target Port:        443
---------------------------------------------------------------------------
+ SSL Info:        Subject:  /CN=inlanefreight.com
                   Altnames: inlanefreight.com, www.inlanefreight.com
                   Ciphers:  TLS_AES_256_GCM_SHA384
                   Issuer:   /C=US/O=Let's Encrypt/CN=R3
+ Start Time:         2024-05-31 13:35:54 (GMT0)
---------------------------------------------------------------------------
+ Server: Apache/2.4.41 (Ubuntu)
+ /: Link header found with value: ARRAY(0x558e78790248). See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link
+ /: The site uses TLS and the Strict-Transport-Security HTTP header is not defined. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
+ /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ /index.php?: Uncommon header 'x-redirect-by' found, with contents: WordPress.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ /: The Content-Encoding header is set to "deflate" which may mean that the server is vulnerable to the BREACH attack. See: http://breachattack.com/
+ Apache/2.4.41 appears to be outdated (current is at least 2.4.59). Apache 2.2.34 is the EOL for the 2.x branch.
+ /: Web Server returns a valid response with junk HTTP methods which may cause false positives.
+ /license.txt: License file found may identify site software.
+ /: A Wordpress installation was found.
+ /wp-login.php?action=register: Cookie wordpress_test_cookie created without the httponly flag. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
+ /wp-login.php:X-Frame-Options header is deprecated and has been replaced with the Content-Security-Policy HTTP header with the frame-ancestors directive instead. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
+ /wp-login.php: Wordpress login found.
+ 1316 requests: 0 error(s) and 12 item(s) reported on remote host
+ End Time:           2024-05-31 13:47:27 (GMT0) (693 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```
<div dir="ltr">

**The reconnaissance scan on `inlanefreight.com` reveals several key findings :**


- `IPs`: The website resolves to both IPv4 (`134.209.24.248`) and IPv6 (`2a03:b0c0:1:e0::32c:b001`) addresses.

- `Server Technology`: The website runs on `Apache/2.4.41 (Ubuntu)`

- `WordPress Presence`: The scan identified a WordPress installation, including the login page (`/wp-login.php`). This suggests the site might be a potential target for common WordPress-related exploits.

- `Information Disclosure`: The presence of a `license.txt` file could reveal additional details about the website's software components.
- `Headers`: Several non-standard or insecure headers were found, including a missing `Strict-Transport-Security` header and a potentially insecure `x-redirect-by` header.
</div>
