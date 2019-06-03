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
    },
    helpScreen: function () {
        // Platform independent end-of-line character
        var endOfLine = require('os').EOL;
        // console colours
        const colours = require('colors');
        // parse package.json for the version number
        const package = require('./package.json');

        //display help screen
        console.log('akamai-staging [a.k.a staging]'.cyan);
        console.log('Read the docs: '.green + 'https://github.com/MarkSMurphy/akamai-staging#readme');
        console.log('Support & bugs: '.magenta + 'https://github.com/MarkSMurphy/akamai-staging/issues');
        console.log(endOfLine);
        console.log('Returns an Akamai Staging network IP address for one or more domains.'.italic);
        console.log(endOfLine);
        console.log('VERSION:'.grey);
        console.log('   ' + package.version.bold);
        console.log(endOfLine);
        console.log('USAGE:'.grey);
        console.log('   ' + 'staging domain [domain [domain] ...]'.bold);
        console.log(endOfLine);
        console.log('EXAMPLE:'.grey);
        console.log('   staging www.akamai.com control.akamai.com');
    }
  };

