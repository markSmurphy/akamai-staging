# Staging

## To Do

* Add support for Akamai OPEN API to lookup naked domain's alias in Property Manager
* ~~`README.md` additions and examples for Windows and Linux O/S~~
* ~~`README.md` examples of debugging~~
* ~~Add `#` comment text to hosts file entry~~
* Add *progress indicator* when looking up multiple entries
* ~~Test `staging` shebang~~
* Include an option specify the target DNS resolver IP address
* ~~Add `--help` screen~~
* Some home ISPs return a provider's IP address when DNS lookups fail (to give the user a friendly `domain not found` page).
  * We could detect that and report it as DNS_LOOKUP_FAIL rather than relay the ISPs default IP address.
* Add [file watcher](https://www.npmjs.com/package/filewatcher) on the `hosts` file to flush the O/S DNS resolver cache when it's written to.
* ~~Add an option to output platform specific location of `hosts` file and command to flush DNS resolver cache.~~
* ~~Remove `bold` attribute from help & syntax output as not all terminals on all platforms support it.~~
