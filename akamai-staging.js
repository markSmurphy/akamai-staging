var debug = require('debug')('staging');
var dns = require('dns');

debug('staging.js Entry: %O', process.argv);
// Loop through command line parameters.  Expecting 'staging.js fqdn [fqdn [fqdn] ... ]'
for (i = 2; i < process.argv.length; i++) {
  debug('Extracted "%s" from the command line', process.argv[i]);
  // Get the Staging IP address of each fully qualified domain name specified and print to the console
  getStagingIPAddress(process.argv[i]) + " " + process.argv[i];
};

function getStagingIPAddress(hostname){
  debug('getStagingIPAddress() Entry');
  // Resolve the hostname to its aliases
  debug('Calling dns.resolveCname(%s)', hostname);


  dns.resolveCname(hostname, function (err, aliases) {
    if (err) {
      debug('An error occurred in dns.resolveCname(%s): %O', hostname, err);
      debug('The record might not be a CNAME.');
    } else {
      debug('Processing returned aliases: %O', aliases);

      // Pick the 1st alias
      debug('Using the 1st alias "%s"', aliases[0])
      var alias = aliases[0];

      // Break down the alias hostname into its constituent parts/segments
      var segments = alias.split(".");
      debug('Split into segments: %O', segments);

      // append "-staging" to the penultimate segment
      var stagingDomain = segments[segments.length - 2] + "-staging";
      debug('Going to be using "%s" instead of "%s"', stagingDomain, segments[segments.length - 2]);

      // Replace the penultimate segment with the "-staging" variant
      segments[segments.length - 2] = stagingDomain;
      debug("Edited segments: %O", segments);

      // Variable where we're going to store the fully qualified Staging variant
      var stagingFQDN = "";

      segments.forEach(element => {
      // Loop through the segments rebuilding them back into a fully qualified domain name
        stagingFQDN = stagingFQDN + element + ".";
      });

      debug('The Staging alias for %s is %s', hostname, stagingFQDN);

      stagingFQDN = stagingFQDN.substring(0, stagingFQDN.length - 1);

      debug('Calling dns.resolve(%s)', stagingFQDN);
      // Resolve the Staging variant fqdn to an IP address

      var dnsSync = require('dns-sync');

      var stagingIPAddress = dnsSync.resolve(stagingFQDN);

      console.log('%s %s', stagingIPAddress, hostname);

      return stagingIPAddress;
      var stagingIPAddress = dns.resolve(stagingFQDN, function (err, addresses) {
        // *** to do *** if (err) throw err;

        debug('DNS returned: %O', addresses);
        debug('Returning: %s', addresses[0]);
        // Return the 1st IP address
        console.log(addresses[0]);
        return addresses[0];
      });

      // Return the Staging IP address along with the original hostname formatted as a hosts file entry
      return stagingIPAddress + " " + hostname

      //console.log(stagingIPAddress + " " + hostname);
    }
  });

  debug('getStagingIPAddress() Exit');
}
