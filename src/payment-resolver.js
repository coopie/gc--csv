// A library of functions (in a funcitonal programming style) which deal with
// resolving payments with customers
var _ = require('lodash');

// Returns a map of paymentId to customerID
function getCustomersForPayment(payments, mandates) {
    return payments.reduce(function(paymentIDToCustomerID, paymentData) {
        var mandateID = paymentData.links.mandate;
        var mandateForPayment = mandates.find(function(mandateData) {
            return mandateData.id === mandateID;
        });
        var customerID = mandateForPayment.links.customer_bank_account;
        paymentIDToCustomerID[paymentData.id] = customerID;
        return paymentIDToCustomerID;
    }, {});
}

function resolvePayments(payments, customers, mandates) {
    var paymentIDToCustomerID = getCustomersForPayment(payments, mandates);

    return payments.map(function(payment) {
        var customerIDForPayment = paymentIDToCustomerID[payment.id];
        var customerForPayment = customers.find(function(customer) {
            return customer.id === customerIDForPayment;
        });
        return {
            'Payment ID': payment.id,
            'Amount': payment.amount,
            'Description': payment.description,
            'First Name': customerForPayment.given_name,
            'Last Name': customerForPayment.last_name
        };
    });
}

module.exports = {
    getCustomersForPayment: getCustomersForPayment,
    resolvePayments: resolvePayments
};
