# Changelog

## [v2.0.1] - MMM DD<sup>th</sup> 2021

### Changed

* Fixed response object initialisation `NULL_POINTER` issue, reported by [deepscan.io](https://deepscan.io/).
* Code improvements recommended by [Codacy](https://www.codacy.com/).
* Performance improvements by deprecating the use of ~~`concat()`~~ and favour of `+=` for string concatenation.

---

## [v2.0.0] - July 14<sup>th</sup> 2021

### New Features

This releases uses a different DNS library so that:

* The lookup of multiple domains is *much* quicker due to DNS queries now being asynchronous.
* The full `CNAME` chain can be recursed so that the Akamai domain is found no matter how deeply nested it is.
* `akamai-staging` will now return a Staging IP address for the following Akamai domains:
  * `edgekey.net`
  * `edgesuite.net`
  * `akamaiedge.net`
* Redirecting output to a file now displays any errors in the console rather than have them written to the target file.
  * This is because errors are now written to `stderr` to separate them from `stdout`.

### ⚠ BREAKING CHANGES

* Dropped **Node** 10 support.

### Added

* Added dependency `native-dns-multisocket`.
* Added dependency `multimatch`.

### Changed

* Updated dependency `debug` to version `4.3.2`.
* Updated dependency `yargs` to version `17.0.1`.

### Removed

* Removed dependency `supports-color`.
* Removed dependency `dns-sync`.

---

## [v1.1.9] - May 13<sup>th</sup> 2021

### Changed

* Updated dependency `supports-color` to version `8.1.1`.
* Updated dependency `chalk` to version `4.1.1`.

---
