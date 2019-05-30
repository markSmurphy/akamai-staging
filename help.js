module.exports = {
    platformSpecific: function () {
        const os = require('os');
        const colours = require('colors');

        var hostsFile = '';
        var cmdFlushDNS = '';

        switch(os.platform()) {
            case 'win32':
                hostsFile = process.env.systemroot.toLowerCase() + '\\system32\\drivers\\etc\\hosts';
                cmdFlushDNS = 'ipconfig /flushdns';
                break;
            case 'linux':
                hostsFile = '/etc/hosts';
                cmdFlushDNS = 'sudo /etc/init.d/dns-clean restart';
                break;
            case 'darwin':
                hostsFile =  '/private/etc/hosts';
                cmdFlushDNS = 'sudo dscacheutil -flushcache';
                break;
            default:
                hostsFile = 'unknown';
                cmdFlushDNS = 'unknown';
        }

        console.log(os.EOL);
        console.log('Hostname: '.yellow + os.hostname());
        console.log('Platform: '.yellow + os.platform());
        console.log('[hosts] file location: '.yellow + hostsFile);
        console.log('Command to flush DNS cache: '.yellow + cmdFlushDNS);
        console.log(os.EOL);
    }
  };

