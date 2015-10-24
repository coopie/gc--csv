// A wrapper around 'request' library which adds all of the default headers to
// the request. Also uses promises instead of callbacks for clear code

// var request = require('request');
var Promise = require('bluebird');

// CONSTANTS: =================================================================
var BASE_URL = 'https://api-sandbox.gocardless.com';
// END CONSTANTS ==============================================================

function GoCardlessRequest(authToken, request) {
    this.options = {
        headers: {
            'GoCardless-Version': '2015-07-06',
            Authorization: 'Bearer ' + authToken,
            Accept: 'application/json',
            'User-Agent': 'Sam Coope' // do we need this?
        }
    };
    this.request = request;
}

// Takes a string of the endpoint desired, e.g ('customers')
GoCardlessRequest.prototype.getAll = function(endpoint) {
    var self = this;
    return getRecursive(BASE_URL + '/' + endpoint, [])
    .catch(function(error) {
        console.error('Error Fetching Data, please wait a couple of seconds and try again');
    });

    function getRecursive(url, data, after) {
        return new Promise(function(fulfil, reject) {
            self.options.uri = after ? url + '?after=' + after : url;
            self.request(self.options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                // something here about the response contains metadata, and i want to remove that
                var responseBody = JSON.parse(body);
                var responseData = responseBody[endpoint];
                data = data.concat(responseData);

                // console.log('body after ' + after + ': ', responseBody);

                // TODO we need to check what the hell this is meant to be
                var nextID = responseBody.meta.cursors.after;
                if (nextID) {
                    fulfil(getRecursive(url, data, nextID));
                } else {
                    fulfil(data);
                }
            });
        });
    }
};

module.exports = GoCardlessRequest;
