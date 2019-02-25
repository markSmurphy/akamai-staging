# Staging - Obtain Akamai Staging IP Addresses

## Overview

Under normal operations, when you browse a domain fronted by Akamai's CDN, the internet's DNS will resolve the domain to the IP address of your nearest Akamai point-of-presence on their **Production** network.

When it is necessary to test a newer Akamai configuration for that domain you need to test that via Akamai's **Staging** network.  To point your machine at the staging network you need acquire a Staging IP address for the given domain, and update your local `hosts` file.

This utility aids that process by accepting one or more fully qualified domain names and listing out their respective **Staging** IP addresses.

---

## Usage

TBC.

1. Usage instructions
2. Will go
3. Here

---

## Restrictions

### Apex domains are not currently supported.

DNS standards do not allow a `CNAME` record in the apex (`A` or `AAAA` are the only allowed record types), and DNS providers get around this in proprietary ways.  The use of `dns.resolveCname` to get the initial alias of the hostname fails because it's not a `CNAME` record that's being returned.

A resolution is being explored.

---