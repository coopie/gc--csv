var assert = require('assert');
var path = require('path');
var moduleName = path.basename(__filename).split('.')[0];

var fs = require('fs');

var GoCardlessRequest = require('../src/gocardless-request');
var shouldReturn = 'should return: ';

var customerInfo = JSON.parse(fs.readFileSync('test/data/customers.json').toString());

function mockRequest(endpoint, after, callback) {
    var maxPageSize = 4;
    if (!after) {
        callback(undefined, makeResponseObject(0, maxPageSize));
    } else {
        indexOfId = customerInfo.findIndex(function(customer) {
            return customer.id === after;
        });
        callback(undefined, makeResponseObject(indexOfId + 1 , indexOfId + 1 + maxPageSize));
    }

    function makeResponseObject(startIndex, endIndex) {
        var response = {};
        response.customers = customerInfo.slice(startIndex, endIndex);
        response.meta = {
            cursors: {
                after: customerInfo[endIndex - 1] ? customerInfo[endIndex - 1].id : null
            }
        };
        return response;
    }
}

describe(moduleName, function() {
    describe('mockRequest', function() {
        describe('slices correctly', function() {
            it(shouldReturn + '4', function(done) {
                mockRequest('customers', undefined, function(error, body) {
                    assert.equal(body.customers.length, 4);
                    done();
                });
            });
        });
        describe('correctly gets data from index 0', function() {
            it(shouldReturn + 'the first 4 elements of the customers JSON', function(done) {
                mockRequest('customers', undefined, function(error, body) {
                    assert.deepEqual(body.customers, customerInfo.slice(0,4));
                    done();
                });
            });
        });
        describe('correctly gets data from index 3', function() {
            it(shouldReturn + 'customers 4 to 8', function(done) {
                mockRequest('customers', 'CU0000CMBGFF0T', function(error, body) {
                    assert.deepEqual(body.customers, customerInfo.slice(4,8));
                    done();
                });
            });
        });
        describe('returns correct after id', function() {
            it(shouldReturn + 'CU0000CB41D238', function(done) {
                mockRequest('customers', 'CU0000CMBGFF0T', function(error, body) {
                    assert.deepEqual(body.meta.cursors.after, 'CU0000CBG1TAPG');
                    done();
                });
            });
        });
    });

    describe('gocardless-request', function() {
        describe('Gets all of the customers', function() {
            it(shouldReturn + '15', function(done) {
                var gcRequester = new GoCardlessRequest(mockRequest);
                gcRequester.getAll('customers')
                .then(function(customers) {
                    assert.equal(customers.length, 15);
                    done();
                });
            });
        });
        describe('Correctly gets customers', function() {
            it(shouldReturn + 'All of the customers', function(done) {
                var gcRequester = new GoCardlessRequest(mockRequest);
                gcRequester.getAll('customers')
                .then(function(customers) {
                    assert.deepEqual(customers, customerInfo);
                    done();
                });
            });
        });
        describe('throws errors correctly', function() {
            it('should throw', function(done) {
                var gcRequester = new GoCardlessRequest(function(endpoint, after, callback) {
                    callback(new Error('blorp'));
                });
                var err;
                gcRequester.getAll('customers')
                .catch(function(error) {
                    assert.equal(error.message, 'blorp');
                    done();
                });
            });
        });

    });

});
