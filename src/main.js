var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = require('request');

var GoCardlessRequest = require('./gocardless-request');
var paymentResolver = require('./payment-resolver');
var csvWriter = require('./csv-writer');

var args = process.argv.slice(2);

var token = args[0];
if (!token) {
    console.error('Please enter a token');
    process.exit();
}
var pathForCSV = args[1] ? args[1] : 'payments.csv';

var gocardlessRequest = new GoCardlessRequest(gcRequest);

main(token, gocardlessRequest);

function main(authToken, requester) {

    // Get all of the payments, customers, customer-accounts and mandates from the sandbox
    console.log('Getting data from GoCardless');
    Promise.props({
        customers: requester.getAll('customers'),
        payments: requester.getAll('payments'),
        mandates: requester.getAll('mandates'),
        customerAccounts: requester.getAll('customer_bank_accounts')
    }).then(function(responses) {
        console.log('Got data');
        var customers = responses.customers;
        var payments = responses.payments;
        var mandates = responses.mandates;
        var customerAccounts = responses.customerAccounts;

        var data = paymentResolver.resolvePayments(payments, customers, customerAccounts, mandates);
        fs.writeFileAsync(pathForCSV, csvWriter.toCSV(data))
        .then(function() {
            console.log('Wrote payment data to ' + pathForCSV);
        });
    });
}

// Request function for gocardless sandbox
function gcRequest(endpoint, after, callback) {
    var BASE_URL = 'https://api-sandbox.gocardless.com';
    var options = {
        headers: {
            'GoCardless-Version': '2015-07-06',
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'User-Agent': 'Sam Coope'
        }
    };
    options.uri = BASE_URL + '/' + endpoint;
    options.uri += after ? '?after=' + after : '';
    return request(options, function(error, resonse, body) {
        return callback(error, JSON.parse(body));
    });
}

module.exports = main;
