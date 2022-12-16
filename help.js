module.exports = {
    platformSpecific: function () {
        const os = require('os');

        // console colours
        const chalk = require('chalk');

        var hostsFile = '';
        var cmdFlushDNS = '';

        switch(os.platform()) {
            case 'win32':
                hostsFile = `${process.env.systemroot.toLowerCase()}\\system32\\drivers\\etc\\hosts`;
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
        console.log(chalk.yellow('Hostname:                   ') + os.hostname());
        console.log(chalk.yellow('Platform:                   ') + os.platform());
        console.log(chalk.yellow('"hosts" file location:      ') + hostsFile);
        console.log(chalk.yellow('Command to flush DNS cache: ') + cmdFlushDNS);
        console.log(os.EOL);
    },
    helpScreen: function (verbose) {
        // Platform independent end-of-line character
        const endOfLine = require('os').EOL;
        // console colours
        const chalk = require('chalk');
        // parse package.json for the version number
        const packageJSON = require('./package.json');

        // Display help screen
        console.log(chalk.blue(packageJSON.name));
        console.log(chalk.green('Read the docs: ') + packageJSON.homepage);
        console.log(chalk.magenta('Support & bugs: ') + packageJSON.bugs.url);
        console.log(endOfLine);
        console.log(chalk.grey('DESCRIPTION:'));
        console.log(chalk.italic('   %s'), packageJSON.description);
        console.log(endOfLine);
        console.log(chalk.grey('VERSION:'));
        console.log(`   ${packageJSON.version}`);
        console.log(endOfLine);
        console.log(chalk.grey('USAGE:'));
        console.log('   ' + 'staging domain [domain [domain] ...]     ');
        console.log(endOfLine);
        console.log(chalk.grey('OPTIONS:'));
        console.log(`   domain [domain [domain] ...]     ${chalk.grey('Lookup Staging IP address for one or more domains')}`);
        console.log(`   --info                           ${chalk.grey('Display platform specific DNS information')}`);
        console.log(`   --version                        ${chalk.grey('Display version number')}`);
        console.log(`   --help                           ${chalk.grey('Display this help')}`);
        console.log(endOfLine);
        console.log(chalk.grey('EXAMPLE:'));
        console.log('   staging www.akamai.com control.akamai.com');
        // Display more information if `verbose` is enabled
        if (verbose) {
            const os = require('os');
            const utils = require('./utils');
            console.log(endOfLine);
            console.log(chalk.grey('SYSTEM:'));
            console.log(`   Hostname           ${chalk.blue(os.hostname())}`);
            console.log(`   Uptime             ${chalk.blue(utils.secondsToHms(os.uptime()))}`);
            console.log(`   Platform           ${chalk.blue(os.platform())}`);
            console.log(`   O/S                ${chalk.blue(os.type())}`);
            console.log(`   O/S release        ${chalk.blue(os.release())}`);
            console.log(`   CPU architecture   ${chalk.blue(os.arch())}`);
            console.log(`   CPU cores          ${chalk.blue(os.cpus().length)}`);
            console.log(`   CPU model          ${chalk.blue(os.cpus()[0].model)}`);
            console.log(`   Free memory        ${chalk.blue(utils.formatBytes(os.freemem()))}`);
            console.log(`   Total memory       ${chalk.blue(utils.formatBytes(os.totalmem()))}`);
            console.log(`   Home directory     ${chalk.blue(os.homedir())}`);
            console.log(`   Temp directory     ${chalk.blue(os.tmpdir())}`);
            console.log(`   Console width      ${chalk.blue(process.stdout.columns)}`);
            console.log(`   Console height     ${chalk.blue(process.stdout.rows)}`);
            console.log(`   Colour support     ${chalk.blue(utils.getColourLevelDesc())}`);
        }
    }
};
