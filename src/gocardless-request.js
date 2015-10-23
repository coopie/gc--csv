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

GoCardlessRequest.prototype.request = function(path) {
    return new Promise(function(fulfil, reject) {
        this.options.uri = BASE_URL + path;
        request(this.options, function(error, repsonse, body) {
            if (error) {
                reject(error);
            }
            var response = JSON.parse(body);
            fulfil(response);
        });
    }.bind(this));

};

module.exports = GoCardlessRequest;

// Client.prototype.request = function(opts, cb) {
//   if (!opts.auth) opts = assignAuthHeader(opts, this.config.token);
//   opts.headers = (opts.headers || {});
//   opts.headers.Accept = 'application/json';
//   opts.headers['User-Agent'] = 'gocardless-node/v' + constants.VERSION;
//   opts.uri = this.config.baseUrl + (opts.path || '');
//   console.log('options: ', opts);
//   return request(opts, cb);
// };
//
// function assignAuthHeader(opts, token) {
//   var authHeader = 'Bearer ' + token;
//   opts.headers = (opts.headers || {});
//   opts.headers.Authorization = (opts.headers.Authorization || authHeader);
//   return opts;
// }
