
var configureGoCardlessClient = require('../gocardless-fixed/lib/gocardless');
var GoCardlessRequest = require('./gocardless-request');

var args = process.argv.slice(2);

var token = args[0];
if (!token) {
    console.error('Please enter a token');
    process.exit();
}

var client = configureGoCardlessClient({
    token: token,
    appId: 'Coope',
    appSecret: 'I secretly love cheese',
    merchantId: '',
    sandbox: true
});

var requestOptions = {
    headers: {
        'GoCardless-Version': '2015-07-06'
    },
    path: '/payments'
};
// client.request(requestOptions, function(error, response, body) {
//     if (error) {
//         console.log('error: ', error);
//     } else {
//         var bodyDOA = JSON.parse(body);
//         console.log(bodyDOA);
//     }
//
// });

// for customer names
// requestOptions.path = "/customers";
// client.request(requestOptions, function(error, response, body) {
//     if (error) {
//         console.log('error: ', error);
//     } else {
//         var bodyDOA = JSON.parse(body);
//         console.log(bodyDOA);
//     }
//
// });

var betterClient = new GoCardlessRequest(token);
betterClient.request('/payments')
.then(function(payments) {
    console.log(payments);
});
