---
title: Information Gathering — Web Edition Skill Assessment
published: 2026-05-07
description: This writeup documents my approach to the HTB Information Gathering — Web Edition skill assessment.
image: /images/posts/img_Writeups/img_SkillsAssessment/Information-Gathering.webp
tags: [WHOIS Lookup, Fingerprinting Techniques, Virtual Hosts, Subdomain Bruteforcing, Web Crawling]
category: Writeups
draft: false
pinned: true
comment: true
lang: en
---

# Skills Assessment

To complete the skills assessment, answer the questions below. You will need to apply a variety of skills learned in this module, including:

- Using `whois`
- Analysing `robots.txt`
- Performing subdomain bruteforcing
- Crawling and analysing results

Demonstrate your proficiency by effectively utilizing these techniques.
Remember to add subdomains to your `hosts` file as you discover them.

Target(s): `154.57.164.67:32585`

> vHosts needed for these questions: `inlanefreight.htb`

---

# Well let's get started

<div align="center">
  <img src="/images/posts/img_Writeups/img_SkillsAssessment/image.gif" alt="let's get started" />
</div>

## 1. What is the IANA ID of the registrar of the inlanefreight.com domain?

The first question is simple because it is asking me to find the IANA ID, so here we will simply use the WHOIS tool to perform a WHOIS query and retrieve the domain registration information (domain name, registrar, IANA ID, registration dates, etc.)

<img src="/images/posts/img_Writeups/img_SkillsAssessment/whois.jpg" alt="WhoIs Lookup"/>


<p style="text-align: center;"><strong>. . .</strong></p>


## 2. What http server software is powering the inlanefreight.htb site on the target system? Respond with the name of the software, not the version, e.g., Apache.

In this question, we are asked to identify the name of the `server software` powering the `inlanefreight.htb` website on the target system, so we will use a fingerprinting technique. One of the fastest methods in this situation is `banner grabbing` using `curl` : 

<img src="/images/posts/img_Writeups/img_SkillsAssessment/CouldNotResolv.png" alt="Could Not Resolv host: inlanefreight.htb"/>


At first the hostname didn’t resolve on my machine (because `inlanefreight.htb` isn’t public DNS-resolvable), so I added it to `/etc/hosts` and pointed it at the target IP:

<img src="/images/posts/img_Writeups/img_SkillsAssessment/HostsFile.jpg" alt="Hosts file" />

After that, I tried again and re-ran the request successfully.

<img src="/images/posts/img_Writeups/img_SkillsAssessment/ServerSoftware.jpg" alt="server software" />

The response headers indicate the web server is `nginx`.


<p style="text-align: center;"><strong>. . .</strong></p>


## 3. What is the API key in the hidden admin directory that you have discovered on the target system?

The question is asking us to find a hidden admin directory, so since it is hidden, it is likely not public. That means they probably don’t want it to appear in search engines, so they might have added a Disallow directive in the robots.txt file to prevent crawlers from indexing it. Therefore, the first thing I did was check robots.txt. 

<img src="/images/posts/img_Writeups/img_SkillsAssessment/robots.jpg" alt="robots.txt file" />

It even returned 404 Not Found and I didn’t get any useful results
> ( I was very confident while doing this step ^_^ )

After this step, I tried to think of a different technique or approach, and eventually decided to perform directory fuzzing to find the hidden admin directory. So I started doing directory brute-forcing using ffuf:

<img src="/images/posts/img_Writeups/img_SkillsAssessment/ffuf.png" alt="FUZZING with ffuf" />

But again, I ended up disappointed — no new or useful results.

After thinking it over, and given that the server is running nginx, I considered that it might be hosting multiple virtual hosts on the same IP address so vhost probing could still reveal additional pages..
 
Based on that, I shifted my focus toward testing various hostnames against a one IP address, and in this phase I used vhost brute-forcing with gobuster:


<img src="/images/posts/img_Writeups/img_SkillsAssessment/gobuster.png" alt="brute-forcing with gobuster" />

This found a vhost: `web1337.inlanefreight.htb`.
As before, `web1337.inlanefreight.htb` didn’t resolve, so I added it to /etc/hosts:

<img src="/images/posts/img_Writeups/img_SkillsAssessment/HostFile_Web1337.jpg" alt="added it to /etc/hosts" />

Next I checked `robots.txt`

<img src="/images/posts/img_Writeups/img_SkillsAssessment/robotsweb1337.jpg" alt="checked robots.txt" />

Good find: robots.txt revealed an /`admin_h1dd3n` directory.

Now that I know the directory name, I used curl to send a request to the page and retrieve the API key from it.

<img src="/images/posts/img_Writeups/img_SkillsAssessment/admin.jpg" alt="result the API key" />

The response contained the API key.


<p style="text-align: center;"><strong>. . .</strong></p>


## 4. After crawling the `inlanefreight.htb` domain on the target system, what is the email address you have found? Respond with the full email, e.g., mail@inlanefreight.htb.

Now I will start crawling the target, and I will use the ReconSpider tool to extract any email addresses from the website.

The first thing I did was run ReconSpider on the `inlanefreight.htb` domain on the target, and after the tool finished, I went to check the `results.json` file where the output is stored. 

<img src="/images/posts/img_Writeups/img_SkillsAssessment/ResultJson.png" alt="no results for file result.json" />
  
No results. Then I crawled `web1337.inlanefreight.htb` :

But again, there were no results, At this point, I was stuck, until I had a realized that a sub-vhost can itself have sub-vhosts. So I tried brute-forcing sub-vhosts for `web1337.inlanefreight.htb`

<img src="/images/posts/img_Writeups/img_SkillsAssessment/gobusterWeb1337.png" alt="dev.web1337" />

That revealed `dev.web1337.inlanefreight.htb`. I added it to /etc/hosts:

<img src="/images/posts/img_Writeups/img_SkillsAssessment/devhostfile.jpg" alt="dev hosts file" />


Then, I ran ReconSpider on the dev vhost:

```bash
AbuEIOyun1@kali[~]$ python3 ReconSpider.py http://dev.web1337.inlanefreight.htb:32585
cat results.json
```

The crawl returned an email address and other artifacts. `results.json` included :

<img src="/images/posts/img_Writeups/img_SkillsAssessment/finalresult.png" alt="final result scrapy" />


```json
{
    "emails": [
        "1337testing@inlanefreight.htb"
    ],
    "links": [
        "http://dev.web1337.inlanefreight.htb:32585/index-114.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-799.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-80.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-203.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-326.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-789.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-350.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-760.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-332.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-895.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-379.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-817.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-513.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-728.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-291.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-660.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-458.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-555.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-567.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-785.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-334.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-733.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-933.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-254.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-947.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-134.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-350.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-408.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-574.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-342.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-755.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-203.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-631.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-525.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-202.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-226.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-626.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-247.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-948.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-949.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-918.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-384.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-989.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-988.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-364.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-909.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-964.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-329.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-939.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-635.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-220.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-77.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-165.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-204.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-385.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-465.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-531.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-815.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-504.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-769.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-795.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-463.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-1000.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-403.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-326.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-798.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-615.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-944.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-561.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-760.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-737.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-553.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-888.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-727.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-335.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-300.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-292.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-938.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-641.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-248.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-789.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-80.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-714.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-748.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-734.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-472.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-925.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-807.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-799.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-189.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-437.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-643.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-585.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-577.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-244.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-581.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-574.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-247.html",
        "http://dev.web1337.inlanefreight.htb:32585/index-631.html"
    ],
    "external_files": [],
    "js_files": [],
    "form_fields": [],
    "images": [],
    "videos": [],
    "audio": [],
    "comments": [
        "<!-- Remember to change the API key to ba988b835be4aa97d068941dc852ff33 -->"
    ]
```

Answer: 1337testing@inlanefreight.htb


<p style="text-align: center;"><strong>. . .</strong></p>


## 5. What is the API key the inlanefreight.htb developers will be changing too?

We already found this in the earlier admin comment. The developer comment in the crawl shows the new API key:

<img src="/images/posts/img_Writeups/img_SkillsAssessment/Remember.jpg" alt="remember" />

