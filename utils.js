const debug = require('debug')('akamai-staging-utils');
debug('Entry :: [%s]', __filename);


function formatBytes(bytes, decimals = 2) {
    try {
        if (bytes === 0) {
            return ('0 Bytes');
        } else {
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    } catch (error) {
        debug('formatBytes() caught an exception: %O', error);
        return(bytes + ' Bytes');
    }
}

function secondsToHms(seconds) {
    if (seconds) {
        try {
            seconds = Number(seconds);

            let h = Math.floor(seconds / 3600);
            let m = Math.floor(seconds % 3600 / 60);
            let s = Math.floor(seconds % 3600 % 60);

            return ('0' + h).slice(-2) + ' hours, ' + ('0' + m).slice(-2) + ' minutes, ' + ('0' + s).slice(-2) + ' seconds';
        } catch (error) {
            debug('secondsToHms() caught an exception: %O', error);
            // an unexpected error occurred; return the original value
            return(seconds + ' seconds');
        }
    } else {
        return('<invalid>');
    }
}

function millisecondsToHms(milliseconds) {
    if (milliseconds) {
        try {
            let seconds = Number(milliseconds/1000);

            let h = Math.floor(seconds / 3600);
            let m = Math.floor(seconds % 3600 / 60);
            let s = Math.floor(seconds % 3600 % 60);

            let returnString = '';

            if (h > 0) {
                returnString = ('0' + h).slice(-2) + ' hours, ';
            }

            if (m > 0) {
                returnString = returnString + ('0' + m).slice(-2) + ' minutes, ';
            }

            if (s > 0) {
                if (s ===1) {
                    returnString = returnString + ('0' + s).slice(-2) + ' second';
                } else {
                    returnString = returnString + ('0' + s).slice(-2) + ' seconds';
                }
            }

            return returnString;
        } catch (error) {
            debug('millisecondsToHms() caught an exception: %O', error);
            // an unexpected error occurred; return the original value
            return(milliseconds + ' milliseconds');
        }
    } else {
        return('<invalid>');
    }
}

function getColourLevelDesc() {
    const colourLevel = ['Colours Disabled', '16 Colours (Basic)', '256 Colours', '16 Million Colours (True Colour)'];

    // Use chalk to detect colour level support
    const chalk = require('chalk');
    let level = chalk.supportsColor.level;

    if (level === null) {
        level = 0;
    }

    return (colourLevel[level]);
}

module.exports = {formatBytes, secondsToHms, millisecondsToHms, getColourLevelDesc};
