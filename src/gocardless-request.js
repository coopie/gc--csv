// An interface to request data from the GoCardless sandbox.

var Promise = require('bluebird');

// request(url, afterID) -> function(error, body)
function GoCardlessRequest(request) {
    this.request = request;
}

// Takes a string of the endpoint desired, e.g 'customers' and gets all of the
// data from the sandbox by recursivley getting the all pages of data.
GoCardlessRequest.prototype.getAll = function(endpoint) {
    var self = this;
    return getRecursive(endpoint, []);

    function getRecursive(url, data, after) {
        // return new Promise(function(fulfil, reject) {
        //     self.options.uri = after ? url + '?after=' + after : url;
        //     self.request(self.options, function(error, response, body) {
        //         if (error) {
        //             reject(error);
        //         }
        //         var responseBody = JSON.parse(body);
        //         var responseData = responseBody[endpoint];
        //         data = data.concat(responseData);
        //
        //         var nextID = responseBody.meta.cursors.after;
        //         // The final page of data has a null pointer to signify the end.
        //         if (nextID === null) {
        //             fulfil(data);
        //         } else {
        //             fulfil(getRecursive(url, data, nextID));
        //         }
        //     });
        // });

        return new Promise(function(fulfil, reject) {
            self.request(url, after, function(error, body) {
                if (error) {
                    reject(error);
                }
                var responseBody = JSON.parse(body);
                var responseData = responseBody[endpoint];
                data = data.concat(responseData);

                var nextID = responseBody.meta.cursors.after;
                // The final page of data has a null pointer to signify the end.
                if (nextID === null) {
                    fulfil(data);
                } else {
                    fulfil(getRecursive(url, data, nextID));
                }
            });
        });
    }
};

module.exports = GoCardlessRequest;
