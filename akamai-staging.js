#!/usr/bin/env node

// verbose logging
const debug = require('debug')('staging');

// Platform independent end-of-line character
const endOfLine = require('os').EOL;

// akamai-staging's own DNS library
const dnsLib = require('./dns-core');

// node DNS library
const dns = require('dns');

// Initialise wildcard string parser
const matcher = require('multimatch');

// Array of Akamai edge domains
const edgeDomains = [
    '*.edgekey.net',
    '*.edgesuite.net',
    '*.akamaiedge.net'
];


function getStagingIPAddress(hostname){
    debug('getStagingIPAddress() Entry');
    // Resolve the hostname to its aliases
    debug('Calling resolveCname(%s)', hostname);


    dnsLib.resolveCname(hostname, (response) => {
        if (response.success === false) {
            debug('An error [%s] occurred in resolveCname(%s): %O', response.message, hostname, response.error);
            debug('No aliases returned. The record "%s" might not be a CNAME.', hostname);
            console.error('# [%s] did not resolve to a CNAME record', hostname);

        } else {

            // Check if any alias matches an Akamai edge domain
            debug('Processing returned aliases: %O', response.aliases);

            let matchingAliases = matcher(response.aliases, edgeDomains);

            if (matchingAliases.length > 0) {
                // There's at least one alias that matches an Akamai edge domain pattern
                debug('These look like Akamai domains: %O', matchingAliases);

                // Use the first alias as it's the one the customer has created a CNAME over
                let alias = matchingAliases[0];
                debug('Using the alias %O', alias);

                // Break down the alias FQDN into its constituent parts/segments
                let segments = alias.split('.');
                debug('[%s] was split into these segments: %O', alias, segments);

                // Append '-staging' to the penultimate segment
                segments[segments.length - 2] += '-staging';
                debug('Edited segment %d so it is now: %O', segments.length - 2, segments);

                // Convert the array into a string storing the fully qualified Staging variant
                let stagingFQDN = segments.join('.');
                debug('The Staging alias for %s is %s', hostname, stagingFQDN);

                debug('Calling dns.lookup(%s)', stagingFQDN);

                // Set DNS lookup options
                let options = {
                    family: 0,
                    verbatim: false
                };

                // Perform lookup of staging FQDN
                dns.lookup(stagingFQDN, options, (err, address, family) => {

                    if (err) {
                        // An error occurred
                        debug('Error: dns.lookup() returned: %O', err);
                        console.error('# %s failed to resolve to an IP address', stagingFQDN);

                    } else {
                        debug('dns.lookup() returned - address: %j family: IPv%s', address, family);
                        // Grab the IP Address
                        let stagingIPAddress = address;

                        // Define the comment we'll annotate the hosts file entry with
                        let comment = `#Akamai Staging variant of [${alias}]`;


                        // Workout a string buffer length (space between host file entry and comment) to tidy up comments' alignment
                        let entryLength = stagingIPAddress.length + hostname.length;

                        const offset = 50;
                        let bufferLength = 5;

                        if (offset > entryLength + 1) {
                            bufferLength = offset - entryLength;
                        }

                        // output Staging IP entry in hosts file format
                        console.log('%s %s %s %s', stagingIPAddress, hostname, ' '.repeat(bufferLength), comment);
                    }
                });
            } else {
              // The DNS answer didn't contain a nested domain that matched a known Akamai domain
              console.error('# %s does not resolve to a known Akamai domain', hostname);
            }
        }
    });
}

try {

    debug('[%s] started: %O', __filename, process.argv);

    // command line options parser
    const argv = require('yargs')
        .help(false)
        .argv;

    if ((process.argv.length === 2) || (argv.help)) {
        // Show help screen
        const help = require('./help');
        help.helpScreen(argv.verbose);

    } else if ((argv.platform) || (argv.info)) {
        // Show platform information
        const help = require('./help');
        help.platformSpecific();

    } else {
        // Print a platform agnostic newline character first. This particularly helps when output is appended to a text file
        console.log(endOfLine);

        // Loop through command line parameters.  Expecting 'akamai-staging.js fqdn [fqdn [fqdn] ... ]'
        for (let i = 2; i < process.argv.length; i++) {
            debug('Extracted "%s" from the command line', process.argv[i]);
            // Get the Staging IP address of each fully qualified domain name specified and print to the console
            getStagingIPAddress(process.argv[i]);
        }
    }
}

catch (e) {
    console.error('An unexpected error occurred: %s', e);
}
