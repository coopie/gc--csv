var assert = require('assert');
var path = require('path');
var moduleName = path.basename(__filename).split('.')[0];

var fs = require('fs');

var GoCardlessRequest = require('../src/gocardless-request');
var shouldReturn = 'should return: ';

var customerInfo = JSON.parse(fs.readFileSync('test/data/customers.json').toString());

function mockRequest(endpoint, after) {
    var maxPageSize = 4;
    if (!after) {
        return makeResponseObject(0, maxPageSize);
    } else {
        indexOfId = customerInfo.findIndex(function(customer) {
            return customer.id === after;
        });
        return makeResponseObject(indexOfId + 1 , indexOfId + 1 + maxPageSize);
    }

    function makeResponseObject(startIndex, endIndex) {
        var response = {};
        response.customers = customerInfo.slice(startIndex, endIndex);
        response.meta = {
            cursors: {
                after: customerInfo[endIndex - 1].id
            }
        };
        return response;
    }
}

describe(moduleName, function() {
    describe('mockRequest', function() {
        describe('slices correctly', function() {
            it(shouldReturn + '4', function() {
                assert.deepEqual(mockRequest('customers').customers.length, 4);
            });
        });
        describe('slices correctly', function() {
            it(shouldReturn + '4', function() {
                assert.deepEqual(mockRequest('customers').customers.length, 4);
            });
        });
        describe('correctly gets data from index 0', function() {
            it(shouldReturn + 'the first 4 elements of the customers JSON', function() {
                assert.deepEqual(mockRequest('customers').customers, customerInfo.slice(0,4));
            });
        });
        describe('correctly gets data from index 3', function() {
            it(shouldReturn + 'customers 4 to 8', function() {
                assert.deepEqual(mockRequest('customers', 'CU0000CMBGFF0T').customers, customerInfo.slice(4,8));
            });
        });
        describe('returns correct after id', function() {
            it(shouldReturn + 'CU0000CB41D238', function() {
                assert.deepEqual(mockRequest('customers', 'CU0000CMBGFF0T').meta.cursors.after, 'CU0000CBG1TAPG');
            });
        });
    });
    describe('gocardless-request', function() {
        describe('Gets all of the customers', function() {
            it(shouldReturn + '15', function() {
                var gcRequester = new GoCardlessRequest(mockRequest);
                gcRequester.getAll('customers')
                .then(function(customers) {
                    assert.deepEqual(cusomers.length, 15);
                });
            });
        });
        describe('Correctly gets customers', function() {
            it(shouldReturn + '15', function() {
                var gcRequester = new GoCardlessRequest(mockRequest);
                gcRequester.getAll('customers')
                .then(function(customers) {
                    assert.deepEqual(cusomers, customerInfo);
                });
            });
        });

    });

});
