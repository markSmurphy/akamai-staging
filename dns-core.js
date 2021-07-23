const debug = require('debug')('akamai-staging-dns-core');
debug('Entry: [%s]', __filename);

// Import DNS library
const dns = require('native-dns-multisocket');

// Platform agnostic new line character
const EOL =  require('os').EOL;

function parseAnswer(answer, options) {
    debug('parseAnswer() called with ---> options: %O ---> answer: %O', options, answer);
    // Validate the answer object has something to parse
    //if (answer === []) {
    if (Array.isArray(answer) && answer.length === 0) {
        debug('"answer" is an empty array. Nothing to parse; returning "no_address"');
        // No IP addresses; `answer` is an empty array
        return(null);
    }

    try {
        let response = '';
        // Extract IP Address
        if ((options === null) || (options.getIpAddress)) {
            // Just get the IP address; i.e. the A record at the end.
            for (let i = 0; i < answer.length; i++) {
                if (Object.prototype.hasOwnProperty.call(answer[i], 'address')) {
                    response = answer[i].address;
                }
            }
        } else if (options.getRecursion) {
            // Get the nested hostnames
            for (let i = 0; i < answer.length; i++){
                // Check if the answer element has a "data" property (which a CNAME record will have)
                if(Object.prototype.hasOwnProperty.call(answer[i], 'data')){
                    response += `${answer[i].name} --> ${answer[i].data}${EOL}`;

                // Check if the answer element has an "address" property (which an A record will have)
                } else if (Object.prototype.hasOwnProperty.call(answer[i], 'address')) {
                    response += `${answer[i].name} --> ${answer[i].address}${EOL}`;

                } else {
                   debug('Warning: There is an unhandled data structure in element [%s] in answer array: %O', i, answer);
                }
            }

        } else if (options.getRecordType) {

            // Get the Resource Record type (CNAME, A, AAA, etc)
            var rrtype = module.exports.resourceRecordType(answer[0].type);
            // Add record type to the response object
            response = rrtype;
            debug('Resource Record Type: %s', rrtype);

        } else if (options.getTTL) {

            // Get the record's time-to-live value
            response = answer[0].ttl;
            debug('TTL: %s', answer[0].ttl);

        } else if (options.getHostnames) {
            // Retrieve all unique hostnames in the full recursive DNS answer

            let hostnames = []; // Initialise results array

            for (let i = 0; i < answer.length; i++){ // Loop through answer

                if(Object.prototype.hasOwnProperty.call(answer[i], 'name')){ // Check for `name` property

                    hostnames.push(answer[i].name); // Add `name` value to results array
                }

            }

            // Deduplicate results array into response object
            response = [...new Set(hostnames)];
        }

        debug('parseAnswer(%s) returning: %s', options, response);
        return(response);

    } catch (error) {
        debug('parseAnswer() caught an exception: %O', error);
        return('error parsing answer');
    }
}

function resolveCname(hostname, callback) {
    // Initialise response object
    let response = {
        success: true,
        hostname: hostname
    };

    try {

        // Save the timestamp of when we started
        const startTime = Date.now();

        // Get local DNS resolvers
        const nodeDns = require('dns');
        let resolvers = nodeDns.getServers();

        // Create Options object
        let options = {
            question: {
                name: hostname,
                type: 'A'
            },
            server: {
                address: resolvers[0],
                port: 53,
                type: 'udp'
            },
            timeout: 2000
        };


        // Create DNS Question object
        let question = dns.Question(
            options.question
        );

        // Create DNS Request object (to "ask" the Question)
        let req = dns.Request({
            question: question,
            server: options.server,
            timeout: options.timeout
        });


        // Request Timeout event
        req.on('timeout', () => {
            let delta = Math.ceil((Date.now()) - startTime);
            debug('The lookup request for [%s] timed out after %s milliseconds', hostname, delta.toString());

            // Set response object object properties with error details
            response.success = false;
            response.message = 'Timeout';
            response.error = null;
            response.duration = delta;

            // Return response object
            callback(response);
        });


        // Request receives a response message event
        req.on('message', (err, answer) => {
            let delta = Math.ceil((Date.now()) - startTime);
            debug('"message" event fired');

            if (err) {
                debug('Error received in DNS response: %O', err);
                response.success = false;
                response.message = 'An error occurred';
                response.error = err;
                response.duration = delta;

                // Return the response
                callback(response);

            } else {

                // Successful answer received

                // Check that the answer is a populated array
                if (Array.isArray(answer.answer) && answer.answer.length) {
                    debug('The resolver [%s] provided the answer: %O', options.server.address, answer);

                    // Populate response object
                    response.answer = JSON.stringify(answer.answer);
                    response.aliases = parseAnswer(answer.answer, {getHostnames: true});
                    response.address = parseAnswer(answer.answer, {getIpAddress: true});
                    response.success = true;
                    response.duration = delta;

                } else {
                    debug('The resolver [%s] provided an empty answer: %O', options.server.address, answer);

                    response.message = 'Non-Existent Domain';
                    response.error = 'NXDomain';
                    response.success = false;
                    response.duration = delta;
                }

                // Return the result
                callback(response);
            }
        });


        // Request finished event
        req.on('end', () => {
            let delta = Math.ceil((Date.now()) - startTime);
            debug('"end" event fired for [%s] after %s milliseconds', hostname, delta.toString());
        });

        debug('resolveCname() is issuing the dns.Request(): %O', req);
        req.send();

    } catch (error) {
        debug('An error occurred in resolveCname(): %O', error);

        // Set response object object properties with error details
        response.success = false;
        response.message = error.message;
        response.error = error;

        // Return response object
        callback(response);
    }
}

module.exports = {resolveCname};