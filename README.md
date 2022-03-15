# akamai-staging

![Version](https://img.shields.io/npm/v/akamai-staging.svg?style=plastic)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/26159c659fcf42b3be8e17b712ca28bf)](https://www.codacy.com/gh/markSmurphy/akamai-staging/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=markSmurphy/akamai-staging&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/11497/projects/14396/branches/266781/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11497&pid=14396&bid=266781)
[![Known Vulnerabilities](https://snyk.io/test/npm/akamai-staging/badge.svg)](https://snyk.io/test/npm/akamai-staging)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/akamai-staging.svg?style=plastic)
![Downloads](https://img.shields.io/npm/dm/akamai-staging.svg?style=plastic)
![Licence](https://img.shields.io/npm/l/akamai-staging.svg?style=plastic)

## Quick Start

- Install globally using `npm install -g akamai-staging`
- Run `staging [domain]`
- Append the output to your local `hosts` file

## Overview

**A command line utility to locate an Akamai Staging network IP address for one or more domains.**

If you work on a website hosted behind Akamai's CDN you will, on occasion, need to test a newer Akamai configuration for your domain via their **Staging** network.  This utility provides you with a staging network IP address for the supplied domain in a `hosts` file format.

---

## Description

Under normal operations, when you browse a domain fronted by Akamai's CDN, the internet's DNS will resolve the domain to the IP address of your nearest Akamai point-of-presence on their **Production** network.

When it is necessary to test a newer Akamai configuration for a domain, you need to override DNS via a local `hosts` file entry which resolves the domain to an IP address in Akamai's **Staging** network.

This utility aids that process by accepting one or more fully qualified domain names and listing out their respective **Staging** IP addresses.

---

## Installation

`npm install -g akamai-staging`

---

## Usage

`staging domain [domain [domain] ...]`

---

## Examples

### A single domain

`staging www.akamai.com`

```bash
C:\> staging www.akamai.com

104.82.168.181 www.akamai.com                         #Akamai Staging variant of [www.akamai.com.edgekey.net]

```

![A single domain](https://marksmurphy.github.io/img/akamai-staging.single-domain.gif)

### Multiple domains

If your front-end consists of multiple domains, you may need to point more than one to the **Staging** network.  You can pass multiple domains, separated by `spaces`, via the command line:

`staging www.asos.com api.asos.com my.asos.com`

```bash
C:\> staging www.asos.com api.asos.com my.asos.com

23.50.57.68 www.asos.com                             #Akamai Staging variant of [snir.www.asos.com.v4.edgekey.net]
23.50.57.240 api.asos.com                            #Akamai Staging variant of [snir.asos.com.v4.edgekey.net]
23.50.57.68 my.asos.com                              #Akamai Staging variant of [snir.www.asos.com.v4.edgekey.net]

```

![Multiple domains](https://marksmurphy.github.io/img/akamai-staging.multiple-domains.gif)

### Redirecting output to `hosts` file

Why not redirect `stdout` to append the `hosts` file, seeing as you're going to need these entries in there anyway.

*NB* **you may have flush your O/S's resolver cache, and flush your browser DNS cache before new `hosts` entry is recognised**

#### Windows (as local admin)

⚠ Make sure you use a double greater-than redirect `>>` to *append* to the target file; using only one will replace the target file and nuke your current `hosts` file.

`C:\> staging www.akamai.com >> %systemroot%\system32\drivers\etc\hosts`

`C:\> type %systemroot%\system32\drivers\etc\hosts`

```text
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#       127.0.0.1       localhost
#       ::1             localhost



23.195.136.39 www.akamai.com                         #Akamai Staging variant of [www.akamai.com.edgekey.net]


```

#### Linux (as root)

#### Error reporting and redirection / piping

All hosts file entries and staging IP addresses are output to `stdout` while all errors are output to `stderr`.
This means that if you use the redirection approach [above](#redirecting-output-to-hosts-file), successful staging IP lookups will be written to the target file while errors appear in the console.

![Redirect to a file](https://marksmurphy.github.io/img/akamai-staging.redirect-to-file.gif)

You can redirect them individually by using the notation `1>` to direct `stdout` and `2>` to redirect `stderr` somewhere else.

*Note*: All errors are printed with a preceding hash character `#`, which denotes a *comment* in the `hosts` file. So, if you wish, you could redirect both `stdout` and `stderr` to the target file without it compromising the `hosts` file structure.

`$ sudo staging www.akamai.com >> /etc/hosts`

`$ cat /etc/hosts`

```bash
127.0.0.1    localhost

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

23.195.136.39 www.akamai.com                         #Akamai Staging variant of [www.akamai.com.edgekey.net]

```

---

## Debugging

`akamai-staging` uses the npm package [debug](https://www.npmjs.com/package/debug "www.npmjs.com").  If you set the environment variable `debug` to `staging` you'll see full debug output.

### Windows

```bash
set debug=staging
staging [domain]
```

### Linux

```bash
DEBUG=staging staging [domain]
```

### Powershell

```bash
$env:debug="staging"
node akamai-staging [domain]
```

---

## Restrictions

### Apex domains are not currently supported

DNS standards do not allow a `CNAME` record in the apex (`A` or `AAAA` are the only allowed record types), and DNS providers get around this in proprietary ways.  The use of `dns.resolveCname` to get the initial alias of the hostname fails because it's not a `CNAME` record that's being returned.

---

## Change Log

The `CHANGELOG.md` can be found [here](./CHANGELOG.md)

---
