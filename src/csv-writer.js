var _ = require('lodash');

// exlpain how this works with an example, takes uniform input
function toCSV(data) {
    if (!_.isArray(data)) {
        throw new TypeError('CSVWRITER: Data input must be an array');
    }
    if (!data[0]) {
        return '';
    }
    var csvString = '';
    var keys = Object.keys(data[0]);

    csvString = keys.reduce(function(str, key) {
        return str += key + ', ';
    }, csvString).slice(0, -2) + '\n';

    return data.reduce(function(str, datum) {
        return str + writeLine(keys, datum);
    }, csvString);

}

function writeLine(keys, obj) {
    return keys.reduce(function(str, key) {
        return str + obj[key] + ', ';
    }, '').slice(0, -2) + '\n';
}

module.exports = {
    toCSV: toCSV,
    writeLine: writeLine
};
