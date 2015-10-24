// A library of functions (in a funcitonal programming style) which deal with
// resolving payments with customers

// Returns a map of paymentId to customerID
function getCustomersForPayment(payments, mandates, customerAccounts) {
    return payments.reduce(function(paymentIDToCustomerID, paymentData) {
        var mandateID = paymentData.links.mandate;
        var mandateForPayment = mandates.find(function(mandateData) {
            return mandateData.id === mandateID;
        });
        var customerAccountID = mandateForPayment.links.customer_bank_account;
        var customerAccount = customerAccounts.find(function(customerAccount) {
            return customerAccountID === customerAccount.id;
        });
        var customerID = customerAccount.links.customer;
        paymentIDToCustomerID[paymentData.id] = customerID;
        return paymentIDToCustomerID;
    }, {});
}

function resolvePayments(payments, customers, customerAccounts, mandates) {
    var paymentIDToCustomerID = getCustomersForPayment(payments, mandates, customerAccounts);

    return payments.map(function(payment) {
        var customerIDForPayment = paymentIDToCustomerID[payment.id];
        var customerForPayment = customers.find(function(customer) {
            return customer.id === customerIDForPayment;
        });

        // if (!customerForPayment) {
        //     return {
        //         'Payment ID': payment.id,
        //         'Amount': payment.amount,
        //         'Description': payment.description,
        //         'First Name': 'unkown',
        //         'Last Name': 'unknown'
        //     };
        // }

        return {
            'Payment ID': payment.id,
            'Amount': payment.amount,
            'Description': payment.description,
            'First Name': customerForPayment.given_name,
            'Last Name': customerForPayment.family_name
        };
    });
}

module.exports = {
    getCustomersForPayment: getCustomersForPayment,
    resolvePayments: resolvePayments
};
