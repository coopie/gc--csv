
var GoCardlessRequest = require('./gocardless-request');
var Promise = require('bluebird');

var args = process.argv.slice(2);

var token = args[0];
if (!token) {
    console.error('Please enter a token');
    process.exit();
}

var gocardlessRequest = new GoCardlessRequest(token);

// Get all of the payments, customers and mandates in the server
Promise.props({
    customers: gocardlessRequest.get('customers'),
    payments: gocardlessRequest.get('payments'),
    mandates: gocardlessRequest.get('mandates')
}).then(function(responses) {
    var customers = responses.customers;
    var payments = responses.payments;
    var mandates = responses.mandates;
    console.log(mandates);

});
//
// betterClient.request('/payments')
// .then(function(payments) {
//     console.log(payments);
// });
