var dns = require('dns');

// Loop through command line parameters.  Expecting 'staging.js fqdn [fqdn [fqdn] ... ]'
for (i = 2; i < process.argv.length; i++) {
  // Get the Staging IP address of each fully qualified domain name specified and print to the console
  getStagingIPAddress(process.argv[i]);
};

function getStagingIPAddress(hostname){
  // Resolve the hostname to its aliases
  dns.resolveCname(hostname, function (err, aliases) {
    // Pick the 1st alias
    var alias = aliases[0];
    
    // Break down the alias hostname into its constituent parts/segments
    var segments = alias.split(".");
    
    // append "-staging" to the penultimate segment
    var stagingDomain = segments[segments.length - 2] + "-staging";
    
    // Replace the penultimate segment with the "-staging" varient
    segments[segments.length - 2] = stagingDomain;

    // Variable where we're going to store the fully qualified Staging varient
    var stagingFQDN = "";

    segments.forEach(element => {
    // Loop through the segments rebuilding them back into a fully qualified domain name
      stagingFQDN = stagingFQDN + element + ".";
    });

    // Resolve the Staging varient fqdn to an IP address
    var stagingIPAddress = dns.resolve(stagingFQDN, function (err, addresses) {
      //if (err) throw err;
      // Return the 1st IP address
      console.log(stagingIPAddress);
      return addresses[0];
    });
    
    // Return the Staging IP address along with the orginal hostname formatted as a hosts file entry
    //return stagingIPAddress + " " + hostname

    console.log(stagingIPAddress + " " + hostname);
  });
}  
