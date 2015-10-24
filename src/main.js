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

// // Get all of the payments, customers and mandates in the server
// Promise.props({
//     customers: gocardlessRequest.get('customers'),
//     payments: gocardlessRequest.get('payments'),
//     mandates: gocardlessRequest.get('mandates')
// }).then(function(responses) {
//     var customers = responses.customers;
//     var payments = responses.payments;
//     var mandates = responses.mandates;
//     console.log(payments.length);
//
//     var data = paymentResolver.resolvePayments(payments, customers, mandates);
//     // console.log(csvWriter.toCSV(data));
//
// });

gocardlessRequest.getAll('customers')
.then(function(customers) {
    console.log(JSON.stringify(customers));
});
