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

var gocardlessRequest = new GoCardlessRequest(token, request);

// Get all of the payments, customers and mandates in the server
console.log('Getting data from GoCardless');
Promise.props({
    customers: gocardlessRequest.getAll('customers'),
    payments: gocardlessRequest.getAll('payments'),
    mandates: gocardlessRequest.getAll('mandates'),
    customerAccounts: gocardlessRequest.getAll('customer_bank_accounts')
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
