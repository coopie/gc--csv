
var gc = require('../gocardless-fixed/lib/gocardless');

var args = process.argv.slice(2);

var token = args[0];
if (!token) {
    console.error('Please enter a token');
    process.exit();
}

var client = gc({
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
client.request(requestOptions, function(error, response, body) {
    if (error) {
        console.log('error: ', error);
    } else {
        console.log('body: ', body);
        var payments = body.payments;
        console.log(body[0].payments);
        console.log('\n\n\n\n\n\n');
        console.log(body[1]);
    }

});
