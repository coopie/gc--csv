// A wrapper around 'request' library which adds all of the default headers to
// the request. Also uses promises instead of callbacks for clear code

var request = require('request');
var Promise = require('bluebird');

// CONSTANTS: =================================================================
var BASE_URL = 'https://api-sandbox.gocardless.com';
// END CONSTANTS ==============================================================

function GoCardlessRequest(authToken) {
    this.options = {
      headers: {
          'GoCardless-Version': '2015-07-06',
          Authorization: 'Bearer ' + authToken,
          Accept: 'application/json',
          'User-Agent': 'sam coope' // do we need this?
      }
  };
}

// Takes a string of the endpoint desired, e.g ('customers')
GoCardlessRequest.prototype.get = function(endpoint) {
    return new Promise(function(fulfil, reject) {
        this.options.uri = BASE_URL + '/' + endpoint;
        request(this.options, function(error, repsonse, body) {
            if (error) {
                reject(error);
            }
            // something here about the response contains metadata, and i want to remove that
            var response = JSON.parse(body)[endpoint];
            fulfil(response);
        });
    }.bind(this));

};

module.exports = GoCardlessRequest;
