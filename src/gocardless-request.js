// An interface to request data from the GoCardless sandbox. Is a JS prototype
var Promise = require('bluebird');

// request params:
//
//  endpoint: an endpoint of the GC api e.g 'customers'
//  after: (optional) the id of the element you wish to get data after
//  callback: function with signiature (error, body), where body is the response
//  JSON from the request
//
// The body this request returns in the callback is a js object, not a JSON string.
function GoCardlessRequest(request) {
    this.request = request;
}

// Takes a string of the endpoint desired, e.g 'customers' and gets all of the
// data from the sandbox by recursivley getting the all pages of data.
//
GoCardlessRequest.prototype.getAll = function(endpoint) {
    var self = this;
    return getRecursive(endpoint, []);

    function getRecursive(endpoint, data, after) {
        return new Promise(function(fulfil, reject) {
            self.request(endpoint, after, function(error, body) {
                if (error) {
                    reject(error);
                }
                var responseData = body[endpoint];
                data = data.concat(responseData);

                var nextID = body.meta.cursors.after;
                // The final page of data has a null pointer to signify the end.
                if (nextID === null) {
                    fulfil(data);
                } else {
                    fulfil(getRecursive(endpoint, data, nextID));
                }
            });
        });
    }
};

module.exports = GoCardlessRequest;
