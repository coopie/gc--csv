var assert = require('assert');
var path = require('path');
var moduleName = path.basename(__filename).split('.')[0];

var paymentResolver = require('../src/payment-resolver');
var shouldReturn = 'should return: ';

describe(moduleName, function() {
    describe('getCustomersForPayment', function() {
        describe('Empty args', function() {
            it(shouldReturn + '{}', function() {
                assert.equal(Object.keys(paymentResolver.getCustomersForPayment([],[])), 0);
            });
        });
        describe('One Payment', function() {
            it(shouldReturn + '{ "payment" : "customer" }', function() {
                var payments = [{
                    id: 'payment',
                    links: {
                        mandate: 'mandate'
                    }
                }];
                var mandates = [{
                    id: 'mandate',
                    links: {
                        customer_bank_account: 'customer-account'
                    }
                }];
                var customerAccounts = [{
                    id: 'customer-account',
                    links: {
                        customer: 'customer'
                    }
                }];
                var expected = {'payment': 'customer'};
                assert.deepEqual(
                    paymentResolver.getCustomersForPayment(
                        payments,
                        mandates,
                        customerAccounts), expected);
            });
        });
    });

    describe('resolvePayments', function() {
        describe('Empty everything', function() {
            it(shouldReturn + ' []', function() {
                assert.deepEqual(paymentResolver.resolvePayments([],[],[]), []);
            });
        });
        describe('One payment, customer, mandate', function() {
            it(shouldReturn + ' payment info for Leroy Jenkins', function() {
                var payments = [{
                    id: 'payment',
                    amount: 1234,
                    description: 'blorp',
                    links: {
                        mandate: 'mandate'
                    }
                }];
                var mandates = [{
                    id: 'mandate',
                    links: {
                        customer_bank_account: 'customer-account'
                    }
                }];
                var customers = [{
                    id: 'customer',
                    given_name: 'Leroy',
                    family_name: 'Jenkins'
                }];
                var customerAccounts = [{
                    id: 'customer-account',
                    links: {
                        customer: 'customer'
                    }
                }];

                var expected = [{
                    'Payment ID': 'payment',
                    'Amount': 1234,
                    'Description': 'blorp',
                    'First Name': 'Leroy',
                    'Last Name': 'Jenkins'
                }];
                assert.deepEqual(
                    paymentResolver.resolvePayments(
                        payments,
                        customers,
                        customerAccounts,
                        mandates), expected);
            });
        });
    });

});
