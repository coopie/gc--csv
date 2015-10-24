var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var GoCardlessRequest = require('./gocardless-request');
var paymentResolver = require('./payment-resolver');
var csvWriter = require('./csv-writer');

var args = process.argv.slice(2);

var token = args[0];
if (!token) {
    console.error('Please enter a token');
    process.exit();
}

var gocardlessRequest = new GoCardlessRequest(token);

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
    console.log('payments: size:', payments.length);
    console.log('mandates: size:', mandates.length);
    console.log('customers: size:', customers.length);

    var data = paymentResolver.resolvePayments(payments, customers, customerAccounts, mandates);
    console.log(csvWriter.toCSV(data));

});

// gocardlessRequest.getAll('customers')
// .then(function(customers) {
//     console.log(JSON.stringify(customers));
// });
